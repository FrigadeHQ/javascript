import path from "path";

// SEE: https://storybook.js.org/docs/react/faq#how-do-i-fix-module-resolution-in-special-environments
const getAbsolutePath = (packageName) =>
  path.dirname(require.resolve(path.join(packageName, "package.json")));

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
  ],

  // docs: {
  //   autodocs: "tag",
  // },
  // previewHead: (head) => `
  //   ${head}
  //   <script src="https://cdn.tailwindcss.com"></script>
  //   <script>
  //     tailwind.config = {
  //       important: '#storybook-root'
  //     }
  //   </script>
  // `,
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {
      builder: {
        viteConfigPath: "./vite.config",
      },
    },
  },

  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
};
export default config;
