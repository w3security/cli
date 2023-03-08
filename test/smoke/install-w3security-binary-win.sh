curl -Lo ./w3security-cli.exe 'https://static.w3security.io/cli/latest/w3security-win.exe'
./w3security-cli.exe --version
chmod -R +x ./w3security-cli
mv ./w3security-cli.exe "/bin/w3security.exe"
w3security --version
