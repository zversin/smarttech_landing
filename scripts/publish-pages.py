#!/usr/bin/env python3
"""Explicitly rebuild legacy Pages after a bot push, then verify its commit.

GITHUB_TOKEN pushes do not themselves trigger a Pages build. Use the scoped
Pages write permission to request one; never assume a successful push is a deploy.
"""

import argparse
import json
import os
import re
import time
from urllib.error import HTTPError
from urllib.request import Request, urlopen


def publish(repository, commit, timeout=600):
    if not re.fullmatch(r'[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+', repository) or not re.fullmatch(r'[a-f0-9]{40}', commit):
        raise ValueError('Invalid repository or commit')
    endpoint = f'https://api.github.com/repos/{repository}/pages/builds'
    headers = {'User-Agent': 'SmartTech-daily-prices', 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28'}
    token = os.environ.get('GH_TOKEN')
    if token:
        headers['Authorization'] = 'Bearer ' + token
    def request(url, method='GET'):
        with urlopen(Request(url, headers=headers, method=method, data=b'{}' if method == 'POST' else None), timeout=30) as response:
            return json.load(response)
    deadline, requested = time.monotonic() + timeout, False
    while time.monotonic() < deadline:
        latest = request(endpoint + '/latest')
        print('Pages:', latest.get('status'), latest.get('commit'), flush=True)
        if latest.get('commit') == commit:
            if latest.get('status') == 'built':
                return
            if latest.get('status') == 'errored':
                raise RuntimeError(f'Pages build failed: {latest.get("error")}')
        elif not requested and latest.get('status') != 'building':
            try:
                request(endpoint, 'POST')
                requested = True
            except HTTPError as exc:
                if exc.code != 409:
                    raise
        time.sleep(10)
    raise TimeoutError(f'Pages did not publish {commit} within {timeout} seconds')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repository', required=True)
    parser.add_argument('--commit', required=True)
    args = parser.parse_args()
    publish(args.repository, args.commit)
