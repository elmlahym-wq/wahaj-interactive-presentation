"""Restore the original public media and verify every SHA-256 hash."""
import hashlib
import json
from pathlib import Path
from urllib.request import urlopen
ROOT = Path(__file__).resolve().parents[1]
for item in json.loads((ROOT / 'media-manifest.json').read_text()):
    target = (ROOT / item['path']).resolve()
    if not target.is_relative_to(ROOT):
        raise ValueError('Invalid media path')
    if target.exists() and hashlib.sha256(target.read_bytes()).hexdigest() == item['sha256']:
        print('Verified:', item['path'])
        continue
    with urlopen(item['url'], timeout=90) as response:
        payload = response.read()
    if hashlib.sha256(payload).hexdigest() != item['sha256']:
        raise ValueError('Integrity check failed: ' + item['path'])
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(payload)
    print('Downloaded:', item['path'])
