import { defineConfig, Options } from 'tsup'
import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin'

const commonConfig: Options = {
  minify: true,
  dts: true,
  format: ['esm', 'cjs'],
  sourcemap: true,
  clean: true,
}
export default defineConfig([
  {
    ...commonConfig,
    esbuildOptions: (options) => {
      // Append "use client" to the top of the react entry point
      options.banner = {
        js: '"use client";',
      }
    },
    esbuildPlugins: [vanillaExtractPlugin()],
    entry: ['src/index.ts'],
    outDir: 'lib',
  },
])
