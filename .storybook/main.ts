import type { StorybookConfig } from '@storybook/react-webpack5'
import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config) => {
    return {
      ...config,
      optimization: {
        ...config.optimization,
        // https://github.com/vanilla-extract-css/vanilla-extract/issues/905
        splitChunks: false,
      },
      plugins: [...(config.plugins ?? []), new VanillaExtractPlugin(), new MiniCssExtractPlugin()],
    }
  },
}
export default config
