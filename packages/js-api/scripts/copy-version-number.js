import fs from 'fs'
import { URL } from 'url'

const packageJson = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8')
)
const versionNumber = packageJson.version
const versionFileContent = `export const VERSION_NUMBER = '${versionNumber}'\n`

fs.writeFileSync(new URL('../src/core/version.ts', import.meta.url), versionFileContent, {
  flag: 'w',
})
