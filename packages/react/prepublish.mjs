import {writeFileSync} from 'fs';
import {fileURLToPath} from 'url';
import {dirname, resolve} from 'path';
const packageJson = await import('./package.json', { assert: { type: 'json' } });

// Mimic __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the path to the version file
const versionFilePath = resolve(__dirname, 'src/version.ts');

// Write the version to the file
writeFileSync(versionFilePath, `export const SDK_VERSION = '${packageJson.version}';`, 'utf8');

console.log(`Successfully wrote version number`)
