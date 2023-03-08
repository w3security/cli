#!/usr/bin/env bash
set -euo pipefail

pushd binary-releases
shasum -a 256 -c w3security-alpine.sha256
shasum -a 256 -c w3security-linux.sha256
shasum -a 256 -c w3security-linux-arm64.sha256
shasum -a 256 -c w3security-macos.sha256
shasum -a 256 -c w3security-win.exe.sha256
shasum -a 256 -c w3security-for-docker-desktop-darwin-x64.tar.gz.sha256
shasum -a 256 -c w3security-for-docker-desktop-darwin-arm64.tar.gz.sha256
shasum -a 256 -c docker-mac-signed-bundle.tar.gz.sha256
shasum -a 256 -c w3security-fix.tgz.sha256
shasum -a 256 -c w3security-protect.tgz.sha256
shasum -a 256 -c w3security.tgz.sha256
gpg --import ../help/_about-this-project/w3security-code-signing-public.pgp
gpg --verify sha256sums.txt.asc
popd
