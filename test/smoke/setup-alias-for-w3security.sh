#!/usr/bin/env bash
set -e

# Force CI to have this built w3security version available in shell used
echo "node ${PWD}/bin/w3security \"\$@\"" > /usr/local/bin/w3security
chmod +x /usr/local/bin/w3security
