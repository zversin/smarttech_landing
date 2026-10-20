#!/usr/bin/env python3
"""Compare published pages and pricing assets with the tested checkout."""

import argparse
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import time
from urllib.parse import urlsplit
from urllib.request import Request, urlopen
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
ASSETS = [
    '/pricing/intant.mjs', '/pricing/config.mjs', '/pricing/calculator.mjs',
    '/site-i18n.js', '/script.js', '/analytics.js', '/videonablyudenie-dlya-etazha/config.mjs',
    '/videonablyudenie-dlya-etazha/script.mjs'
]


def verify(base, timeout):
    routes = [urlsplit(e.text).path for e in ET.parse(ROOT / 'sitemap.xml').getroot().findall('{*}url/{*}loc')]
    paths = routes + ASSETS
    deadline = time.monotonic() + timeout
    pending = paths
    def check(path):
        target = ROOT / (path.lstrip('/') + ('index.html' if path.endswith('/') else ''))
        try:
            request = Request(base.rstrip('/') + path, headers={'Cache-Control': 'no-cache', 'User-Agent': 'SmartTech-deployment-check/1.0'})
            with urlopen(request, timeout=25) as response:
                return path, response.status == 200 and response.read() == target.read_bytes()
        except OSError:
            return path, False
    while True:
        with ThreadPoolExecutor(max_workers=4) as executor:
            pending = [path for path, ok in executor.map(check, pending) if not ok]
        if not pending:
            print(f'HTTP OK: {len(routes)} pages and {len(ASSETS)} pricing assets match the tested checkout.')
            return
        if time.monotonic() >= deadline:
            raise RuntimeError('Published content missing or stale: ' + ', '.join(pending))
        print(f'Waiting for {len(pending)} published files...', flush=True)
        time.sleep(10)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base', required=True)
    parser.add_argument('--timeout', type=int, default=60)
    args = parser.parse_args()
    verify(args.base, args.timeout)
