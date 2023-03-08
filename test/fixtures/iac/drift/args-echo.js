const fs = require("fs")

if (process.env.DCTL_EXIT_CODE) {
  process.stderr.write('something wrong happened')
  process.exit(process.env.DCTL_EXIT_CODE)
}

const args = process.argv.slice(2);
const DCTL_IS_W3SECURITY = process.env.DCTL_IS_W3SECURITY;

let buffer = "";
buffer += `DCTL_IS_W3SECURITY=${DCTL_IS_W3SECURITY}\n`
buffer += `ARGS=${args.join(' ')}\n`

if (args[0] === 'scan') {
  let file = fs.readFileSync('iac/drift/output/output.json')
  process.stdout.write(file.toString())
}

if (args[0] === 'fmt') {
  const stdinBuffer = fs.readFileSync(0);
  buffer += `STDIN=${stdinBuffer.toString()}`
}

if (process.env.W3SECURITY_FIXTURE_OUTPUT_PATH) {
  fs.appendFileSync(process.env.W3SECURITY_FIXTURE_OUTPUT_PATH, buffer)
}

