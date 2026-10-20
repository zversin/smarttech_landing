"""Exercise a future supplier refresh without changing the real checkout."""

import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('supplier_reader', ROOT / 'scripts/update-intant.py')
supplier_reader = importlib.util.module_from_spec(spec)
spec.loader.exec_module(supplier_reader)


class FuturePriceRefresh(unittest.TestCase):
    def test_price_increase_and_minimum_order_after_large_price_drop(self):
        for scenario in ['increase', 'minimum-order']:
            with self.subTest(scenario=scenario), tempfile.TemporaryDirectory() as directory:
                checkout = Path(directory) / 'site'
                shutil.copytree(ROOT, checkout, ignore=shutil.ignore_patterns('.git', '__pycache__', 'node_modules', '.env', '.env.*'))
                snapshot = checkout / 'pricing/intant.mjs'
                state = supplier_reader.load_snapshot(snapshot)
                for index, item in enumerate(state['items'].values(), 1):
                    item['price'] = item['price'] + index * 10001 if scenario == 'increase' else 100
                state['priceListDate'] = '2026-10-21'
                snapshot.write_text('export default ' + json.dumps(state, ensure_ascii=False, indent=2) + ';\n')
                for command in [['npm', 'test'], ['npm', 'run', 'build'], ['npm', 'run', 'lint']]:
                    result = subprocess.run(command, cwd=checkout, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
                    self.assertEqual(result.returncode, 0, result.stdout)
                prices = {key: item['price'] for key, item in state['items'].items()}
                door_total = ((prices['terminal341'] + prices['power'] + prices['raincover'] + 85000 + 4999) // 5000) * 5000
                text = (checkout / 'dlya-zhilyh-kompleksov/index.html').read_text()
                self.assertIn(f'{door_total:,}'.replace(',', ' ') + ' ₸', text)
                self.assertIn('21.10.2026', text)
                generated = (checkout / 'site-i18n.js').read_text()
                for lang in ['kz', 'en']:
                    prefix = f'Object.assign(window.smarttechTranslations.{lang}, '
                    price_lines = [line for line in generated.splitlines() if line.startswith(prefix) and '"resPrice0"' in line]
                    data = json.loads(price_lines[-1][len(prefix):-2])
                    self.assertEqual(int(''.join(x for x in data['resPrice0'] if x.isdigit())), door_total)
                    self.assertIn('21', data['accessPricing'])
                if scenario == 'minimum-order':
                    floor = (checkout / 'videonablyudenie-dlya-etazha/index.html').read_text()
                    self.assertIn('115\u00a0000', floor)


if __name__ == '__main__':
    unittest.main()
