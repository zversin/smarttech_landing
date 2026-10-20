#!/usr/bin/env python3
"""Refresh the complete public INTANT price snapshot, or leave it untouched.

Uses only Python's standard library. Network/parse failures never write partial
prices. The caller must build, test and publish the resulting repository changes.
"""

import argparse
from datetime import date, datetime, timedelta
from decimal import Decimal, InvalidOperation
import hashlib
from html.parser import HTMLParser
from io import BytesIO
import json
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit
from urllib.request import Request, urlopen
from xml.etree import ElementTree as ET
from zipfile import ZipFile
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent.parent
SNAPSHOT = ROOT / 'pricing/intant.mjs'
NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
          'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']


def load_snapshot(path=SNAPSHOT):
    text = path.read_text(encoding='utf-8')
    if not text.startswith('export default ') or not text.rstrip().endswith(';'):
        raise ValueError('Unexpected supplier snapshot format')
    return json.loads(text[len('export default '):].rstrip().removesuffix(';'))


def download(url):
    parsed = urlsplit(url)
    if parsed.scheme != 'https' or parsed.hostname not in {'intant.kz', 'bitrix.intant.kz'}:
        raise ValueError('Supplier URL must use an official INTANT HTTPS host')
    request = Request(url, headers={'User-Agent': 'SmartTech-public-price-check/1.0'})
    with urlopen(request, timeout=90) as response:
        final = urlsplit(response.url)
        if final.scheme != 'https' or final.hostname not in {'intant.kz', 'bitrix.intant.kz'}:
            raise ValueError('Unexpected supplier redirect')
        data = response.read(80 * 1024 * 1024 + 1)
        if len(data) > 80 * 1024 * 1024:
            raise ValueError('Supplier response exceeds expected size')
        return data


def normalize(value):
    return re.sub(r'\s+', '', value).casefold()


def positive_price(value):
    try:
        number = Decimal(str(value).replace('\u00a0', '').replace(' ', ''))
    except InvalidOperation as exc:
        raise ValueError(f'Invalid supplier price: {value!r}') from exc
    if not number.is_finite() or number != number.to_integral_value() or not 0 < number < 100_000_000:
        raise ValueError(f'Expected a positive integer KZT price, got {value!r}')
    return int(number)


def parse_date(text):
    match = re.fullmatch(r'(\d{1,2})\s+(\S+)\s+(\d{4})\s+г\.', text.strip())
    if not match or match[2] not in MONTHS:
        raise ValueError(f'Unrecognized price-list date: {text!r}')
    return date(int(match[3]), MONTHS.index(match[2]) + 1, int(match[1]))


def workbook_prices(data, items, today):
    """Find the retail column, exact supplier SKUs, models, currency and date."""
    wanted = {item['supplierSku']: (key, item) for key, item in items.items() if 'supplierSku' in item}
    if len(wanted) != sum('supplierSku' in item for item in items.values()):
        raise ValueError('Duplicate supplier SKUs in configured bill of materials')
    found, dates = {}, set()
    with ZipFile(BytesIO(data)) as archive:
        xml_files = [x for x in archive.infolist() if x.filename.endswith('.xml')]
        if any(x.file_size > 64 * 1024 * 1024 for x in xml_files) or sum(x.file_size for x in xml_files) > 128 * 1024 * 1024:
            raise ValueError('Price-list XML exceeds expected size')
        strings = []
        if 'xl/sharedStrings.xml' in archive.namelist():
            shared = ET.fromstring(archive.read('xl/sharedStrings.xml'))
            strings = [''.join(t.text or '' for t in si.findall('.//m:t', NS)) for si in shared]
        for filename in sorted(archive.namelist()):
            if not re.fullmatch(r'xl/worksheets/sheet\d+\.xml', filename):
                continue
            sheet = ET.fromstring(archive.read(filename))
            rows = []
            for row in sheet.findall('.//m:sheetData/m:row', NS):
                values = {}
                for cell in row.findall('m:c', NS):
                    column = re.sub(r'\d+', '', cell.attrib['r'])
                    raw = cell.find('m:v', NS)
                    value = raw.text if raw is not None else ''
                    if cell.attrib.get('t') == 's':
                        value = strings[int(value)]
                    elif cell.attrib.get('t') == 'inlineStr':
                        value = ''.join(t.text or '' for t in cell.findall('.//m:t', NS))
                    values[column] = value or ''
                rows.append(values)
            # Each sheet must identify its own currency, date and column labels.
            currency = [r.get('D') for r in rows if r.get('A') == 'Валюта:']
            sheet_dates = [parse_date(r['D']) for r in rows if r.get('A') == 'Дата:']
            header = next((r for r in rows if r.get('A') == 'Товар'), None)
            if not header or currency != ['Казахстанский теңге'] or len(sheet_dates) != 1:
                raise ValueError(f'Missing date, KZT currency or product header in {filename}')
            dates.update(sheet_dates)
            columns = {normalize(label): col for col, label in header.items() if label}
            try:
                price_col = columns[normalize('Интернет - Магазин')]
                sku_col = columns[normalize('Артикул')]
            except KeyError as exc:
                raise ValueError('Retail-price or supplier-SKU column is missing') from exc
            for row in rows:
                sku = row.get(sku_col)
                if sku not in wanted:
                    continue
                key, item = wanted[sku]
                if key in found:
                    raise ValueError(f'Duplicate supplier row for {sku}')
                if normalize(item['model']) not in normalize(row.get('A', '')):
                    raise ValueError(f'Supplier model changed for {sku}: {row.get("A")}')
                found[key] = positive_price(row.get(price_col, ''))
    if len(dates) != 1:
        raise ValueError('Price-list dates disagree between sheets')
    price_date = dates.pop()
    if not today - timedelta(days=3) <= price_date <= today:
        raise ValueError(f'Price list is stale or future-dated: {price_date}')
    missing = [key for key, _ in wanted.values() if key not in found]
    if missing:
        raise ValueError(f'Exact supplier SKUs missing: {", ".join(missing)}')
    return found, price_date


class ProductText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.hidden = 0
        self.in_h1 = False
        self.headings = []
        self.text = []

    def handle_starttag(self, tag, attrs):
        if tag in {'script', 'style'}:
            self.hidden += 1
        if tag == 'h1':
            self.in_h1 = True

    def handle_endtag(self, tag):
        if tag in {'script', 'style'}:
            self.hidden = max(0, self.hidden - 1)
        if tag == 'h1':
            self.in_h1 = False

    def handle_data(self, value):
        if not self.hidden and value.strip():
            self.text.append(value.strip())
            if self.in_h1:
                self.headings.append(value.strip())


def product_price(data, model):
    parser = ProductText()
    parser.feed(data.decode('utf-8'))
    heading = ' '.join(parser.headings)
    if normalize(model) not in normalize(heading):
        raise ValueError(f'Product heading does not identify {model}')
    text = ' '.join(parser.text)
    # Bound extraction to the primary product, before related/recommended items.
    product = text[text.index(parser.headings[0]):]
    product = re.split(r'Рейтинг:|Описание', product, maxsplit=1)[0]
    prices = re.findall(r'(?<![\w.,])(\d{1,3}(?:[\s\u00a0]\d{3})+|\d+)\s+KZT\b', product)[:2]
    if not prices or len({positive_price(x) for x in prices}) != 1:
        raise ValueError(f'Missing or ambiguous primary product price for {model}')
    return positive_price(prices[0])


def refresh(snapshot_path=SNAPSHOT, *, force=False, workbook=None, fetch=download, now=None):
    state = load_snapshot(snapshot_path)
    now = now or datetime.now(ZoneInfo('Asia/Qyzylorda'))
    data = workbook if workbook is not None else fetch(state['source'])
    prices, price_date = workbook_prices(data, state['items'], now.date())
    for key, item in state['items'].items():
        if 'supplierSku' not in item:
            prices[key] = product_price(fetch(item['source']), item['model'])
    changes = []
    for key, price in prices.items():
        old = state['items'][key]['price']
        if old != price:
            changes.append(f'{state["items"][key]["model"]}: {old:,} → {price:,} ₸')
    if changes or force:
        state['checkedAt'] = now.isoformat()
        state['priceListDate'] = price_date.isoformat()
        state['sourceSha256'] = hashlib.sha256(data).hexdigest()
        for key, price in prices.items():
            state['items'][key]['price'] = price
        # Only write after every price source has been checked successfully.
        temporary = snapshot_path.with_suffix('.tmp')
        temporary.write_text('export default ' + json.dumps(state, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
        temporary.replace(snapshot_path)
    return changes, len(prices), price_date


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--force', action='store_true', help='Refresh the dated snapshot even if all prices are unchanged')
    parser.add_argument('--xlsx', type=Path, help='Use a downloaded official XLSX; product-page prices are still fetched live')
    parser.add_argument('--summary', type=Path, help='Write an execution summary, outside the published checkout')
    args = parser.parse_args()
    changes, count, price_date = refresh(force=args.force, workbook=args.xlsx.read_bytes() if args.xlsx else None)
    summary = f'INTANT: проверено {count} точных позиций; прайс {price_date}.\n'
    summary += '\n'.join(changes) if changes else 'Цены не изменились.\n'
    print(summary)
    if args.summary:
        args.summary.write_text(summary, encoding='utf-8')


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print(f'INTANT update stopped; previous prices preserved: {exc}', file=sys.stderr)
        sys.exit(1)
