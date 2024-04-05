import { Banner, Box, Flex } from "@frigade/react";
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
        <Flex.Row>
          <Box flex="0 0 50%">
            <Banner flowId="flow_ZZ6Fz6nt" />
          </Box>
          <Box flex="0 0 50%" marginLeft="auto">
            <Banner flowId="flow_gY36aLgO" />
          </Box>
        </Flex.Row>
      );
    },
  ],
};
