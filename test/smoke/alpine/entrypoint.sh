#!/bin/sh

curl -Lo ./w3security-cli 'https://static.w3security.io/cli/latest/w3security-alpine'
chmod -R +x ./w3security-cli
mv ./w3security-cli /usr/local/bin/w3security
w3security --version

shellspec -f d
