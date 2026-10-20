import copy
from datetime import date, datetime
import importlib.util
from io import BytesIO
import json
from pathlib import Path
import tempfile
import unittest
from xml.etree import ElementTree as ET
from zipfile import ZipFile
from zoneinfo import ZoneInfo

spec = importlib.util.spec_from_file_location('update_intant', Path(__file__).with_name('update-intant.py'))
updater = importlib.util.module_from_spec(spec)
spec.loader.exec_module(updater)


def workbook(items, *, date_text='20 октября 2026 г.', currency='Казахстанский теңге', transform=None):
    rows = [
        {'A': 'Дата:', 'D': date_text},
        {'A': 'Валюта:', 'D': currency},
        {'A': 'Товар', 'S': 'Артикул', 'AX': 'Интернет - Магазин'}
    ]
    for item in items.values():
        if 'supplierSku' in item:
            rows.append({'A': item['model'], 'S': item['supplierSku'], 'AX': str(item['price'])})
    if transform:
        rows = transform(rows)
    root = ET.Element('worksheet', xmlns=updater.NS['m'])
    sheet = ET.SubElement(root, 'sheetData')
    for index, values in enumerate(rows, 1):
        row = ET.SubElement(sheet, 'row', r=str(index))
        for column, value in values.items():
            cell = ET.SubElement(row, 'c', r=f'{column}{index}', t='inlineStr')
            ET.SubElement(ET.SubElement(cell, 'is'), 't').text = value
    buffer = BytesIO()
    with ZipFile(buffer, 'w') as archive:
        archive.writestr('xl/worksheets/sheet1.xml', ET.tostring(root))
    return buffer.getvalue()


class SupplierChecks(unittest.TestCase):
    def setUp(self):
        self.state = copy.deepcopy(updater.load_snapshot())
        self.today = date(2026, 10, 20)

    def test_exact_skus_and_header_selected_retail_column(self):
        prices, price_date = updater.workbook_prices(workbook(self.state['items']), self.state['items'], self.today)
        self.assertEqual(price_date, self.today)
        self.assertEqual(prices['terminal341'], self.state['items']['terminal341']['price'])
        self.assertEqual(len(prices), 17)

    def test_missing_and_duplicate_skus_are_rejected(self):
        for transform in [lambda rows: rows[:-1], lambda rows: rows + [rows[-1]]]:
            with self.subTest(transform=transform), self.assertRaises(ValueError):
                updater.workbook_prices(workbook(self.state['items'], transform=transform), self.state['items'], self.today)

    def test_wrong_model_under_same_sku_is_rejected(self):
        def change(rows):
            rows[3]['A'] = 'THC-T150-P (3.6 мм)'
            return rows
        with self.assertRaises(ValueError):
            updater.workbook_prices(workbook(self.state['items'], transform=change), self.state['items'], self.today)

    def test_stale_future_or_foreign_currency_is_rejected(self):
        for options in [{'date_text': '15 октября 2026 г.'}, {'date_text': '21 октября 2026 г.'}, {'currency': 'USD'}]:
            with self.subTest(options=options), self.assertRaises(ValueError):
                updater.workbook_prices(workbook(self.state['items'], **options), self.state['items'], self.today)

    def test_invalid_prices_are_rejected(self):
        for price in ['0', '-1', 'NaN', '1.5', 'По запросу']:
            with self.subTest(price=price), self.assertRaises(ValueError):
                updater.positive_price(price)

    def test_related_product_price_is_not_used(self):
        html = '<h1>DS-K3G411LX-R/Pg-Dm55</h1><p>543 456 KZT</p><p>543 456 KZT</p><p>Описание</p><p>1 000 KZT</p>'.encode()
        self.assertEqual(updater.product_price(html, 'DS-K3G411LX-R/Pg-Dm55'), 543456)
        with self.assertRaises(ValueError):
            updater.product_price(html.replace(b'543 456 KZT', b'no price'), 'DS-K3G411LX-R/Pg-Dm55')
        with self.assertRaises(ValueError):
            updater.product_price(html, 'DS-K3G301LX-R/Pg-Dm55')

    def test_ambiguous_sale_and_old_price_is_rejected(self):
        html = b'<h1>DS-K3G411LX-R/Pg-Dm55</h1>500 000 KZT 543 456 KZT'
        with self.assertRaises(ValueError):
            updater.product_price(html, 'DS-K3G411LX-R/Pg-Dm55')

    def test_late_network_failure_preserves_entire_snapshot(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'intant.mjs'
            original = 'export default ' + json.dumps(self.state, ensure_ascii=False) + ';\n'
            path.write_text(original)
            def fail(url):
                raise OSError('supplier unavailable')
            with self.assertRaises(OSError):
                updater.refresh(path, force=True, workbook=workbook(self.state['items']), fetch=fail,
                                now=datetime(2026, 10, 20, tzinfo=ZoneInfo('Asia/Qyzylorda')))
            self.assertEqual(path.read_text(), original)

    def test_unchanged_prices_do_not_rewrite_without_force(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'intant.mjs'
            original = 'export default ' + json.dumps(self.state, ensure_ascii=False) + ';\n'
            path.write_text(original)
            html = f'<h1>DS-K3G411LX-R/Pg-Dm55</h1>{self.state["items"]["turnstile"]["price"]:,} KZT'.replace(',', ' ').encode()
            changes, count, _ = updater.refresh(path, workbook=workbook(self.state['items']), fetch=lambda _: html,
                                                now=datetime(2026, 10, 20, tzinfo=ZoneInfo('Asia/Qyzylorda')))
            self.assertEqual(changes, [])
            self.assertEqual(count, 18)
            self.assertEqual(path.read_text(), original)


if __name__ == '__main__':
    unittest.main()
