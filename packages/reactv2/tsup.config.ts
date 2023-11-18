import { defineConfig, Options } from 'tsup'

const commonConfig: Options = {
  minify: true,
  dts: true,
  format: ['esm', 'cjs'],
  sourcemap: true,
  clean: true,
  bundle: true,
  splitting: true,
  skipNodeModulesBundle: true,
}
export default defineConfig([
  {
    ...commonConfig,
    esbuildOptions: (options) => {
      // Append "use client" to the top of the react entry point
      options.banner = {
        js: '"use client";',
      }

      options.bundle = true

      options.jsxImportSource = '@emotion/react'
    },
    entry: ['src/index.ts'],
    outDir: 'dist',
  },
])
