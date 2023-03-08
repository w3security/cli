#!/usr/bin/env bash
set -euo pipefail

cat binary-releases/*.sha256 > binary-releases/sha256sums.txt

echo "Importing PGP key"
echo "${W3SECURITY_CODE_SIGNING_PGP_PRIVATE}" \
    | base64 --decode \
    | gpg --import --batch --passphrase "${W3SECURITY_CODE_SIGNING_GPG_PASSPHRASE}"

echo "Signing shasums file"
gpg \
    --clear-sign \
    --local-user=3676C4B8289C296E \
    --passphrase="${W3SECURITY_CODE_SIGNING_GPG_PASSPHRASE}" \
    --pinentry-mode=loopback \
    --armor \
    --batch binary-releases/sha256sums.txt

rm binary-releases/sha256sums.txt
cat binary-releases/sha256sums.txt.asc
