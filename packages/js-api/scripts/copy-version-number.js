const fs = require('fs')
const path = require('path')

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'))
const versionNumber = packageJson.version

const versionFileContent = `export const VERSION_NUMBER = '${versionNumber}'\n`
fs.writeFileSync(path.join(__dirname, '../src/core/version.ts'), versionFileContent, { flag: 'w' })
