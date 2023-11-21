import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import type { Options } from 'tsup'
import { defineConfig } from 'tsup'

const DIST_PATH = './dist'

async function addDirectivesToChunkFiles(distPath = DIST_PATH): Promise<void> {
  try {
    const files = await fs.readdir(distPath)

    for (const file of files) {
      if (file.endsWith('.mjs') || file.endsWith('.js')) {
        const filePath = path.join(distPath, file)

        // eslint-disable-next-line no-await-in-loop -- We need to wait for each file to be read
        const data = await fs.readFile(filePath, 'utf8')

        const updatedContent = `'use client';\n${data}`

        // eslint-disable-next-line no-await-in-loop -- We need to wait for each file to be written
        await fs.writeFile(filePath, updatedContent, 'utf8')

        // eslint-disable-next-line no-console -- We need to log the result
        console.log(`Directive has been added to ${file}`)
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console -- We need to log the error
    console.error('Error:', err)
  }
}

export default defineConfig((options: Options) => ({
  clean: !options.watch,
  dts: true,
  minify: true,
  entry: ['src/index.ts'],
  external: ['react'],
  format: ['esm', 'cjs'],
  async onSuccess() {
    await addDirectivesToChunkFiles()
  },
  outDir: DIST_PATH,
  sourcemap: true,
  splitting: true,
  target: 'esnext',
  treeshake: true,
  ...options,
}))
