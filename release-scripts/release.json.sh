#!/usr/bin/env bash
set -euo pipefail

OUTPUT_FILE="binary-releases/release.json"

cp ./release-scripts/release.json "${OUTPUT_FILE}"

if [[ $(uname -s) == "Darwin" ]];then
    echo "this is Mac"
    sed -i "" "s|1.0.0-monorepo|$(cat binary-releases/version)|g" "${OUTPUT_FILE}"
    sed -i "" "s|w3security-alpine-sha256|$(cat binary-releases/w3security-alpine.sha256)|" "${OUTPUT_FILE}"
    sed -i "" "s|w3security-linux-sha256|$(cat binary-releases/w3security-linux.sha256)|" "${OUTPUT_FILE}"
    sed -i "" "s|w3security-linux-arm64-sha256|$(cat binary-releases/w3security-linux-arm64.sha256)|" "${OUTPUT_FILE}"
    sed -i "" "s|w3security-macos-sha256|$(cat binary-releases/w3security-macos.sha256)|" "${OUTPUT_FILE}"
    sed -i "" "s|w3security-win.exe-sha256|$(cat binary-releases/w3security-win.exe.sha256)|" "${OUTPUT_FILE}"
else
    echo "this is Linux"
    sed -i "s|1.0.0-monorepo|$(cat binary-releases/version)|g" "${OUTPUT_FILE}"
    sed -i "s|w3security-alpine-sha256|$(cat binary-releases/w3security-alpine.sha256)|" "${OUTPUT_FILE}"
    sed -i "s|w3security-linux-sha256|$(cat binary-releases/w3security-linux.sha256)|" "${OUTPUT_FILE}"
    sed -i "s|w3security-linux-arm64-sha256|$(cat binary-releases/w3security-linux-arm64.sha256)|" "${OUTPUT_FILE}"
    sed -i "s|w3security-macos-sha256|$(cat binary-releases/w3security-macos.sha256)|" "${OUTPUT_FILE}"
    sed -i "s|w3security-win.exe-sha256|$(cat binary-releases/w3security-win.exe.sha256)|" "${OUTPUT_FILE}"
fi

# sanity check if release.json is a valid JSON
jq '.' "${OUTPUT_FILE}"
