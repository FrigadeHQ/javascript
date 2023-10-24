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
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@storybook/addon-interactions"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  // previewHead: (head) => `
  //   ${head}
  //   <script src="https://cdn.tailwindcss.com"></script>
  //   <script>
  //     tailwind.config = {
  //       important: '#storybook-root'
  //     }
  //   </script>
  // `,
};
export default config;
