import { Banner, Box } from "@frigade/react";
import { StoryContext, StoryFn } from "@storybook/react";

export default {
  title: "rules/Two Banners",
  component: Banner,
};

export const Default = {
  args: {
    dismissible: true,
  },
  decorators: [
    (_: StoryFn, options: StoryContext) => {
      return (
        <Box>
          <Banner flowId="flow_ZZ6Fz6nt" />
          <Banner flowId="flow_gY36aLgO" />
        </Box>
      );
    },
  ],
};
