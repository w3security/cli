#!/usr/bin/env bash
set -euo pipefail

releaseTar=$(pwd)/binary-releases/w3security.tgz

echo 'Creating temp directory for sandbox validation...'
pushd $(mktemp -d)

echo 'Running "npm install binary-releases/w3security.tgz"...'
npm install $releaseTar

echo 'Validating "w3security" command succeeds...'
./node_modules/w3security/bin/w3security -d

popd
