#!/bin/sh

set -ex

whoami
npm --version
npm install w3security -g
w3security --version
su node -c "w3security --version"
shellspec -f d
