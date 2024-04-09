import { useEffect, useState } from "react";
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
      const [showLateBanner, setShowLateBanner] = useState(false);

      useEffect(() => {
        setTimeout(() => {
          setShowLateBanner(true);
        }, 3000);
      }, []);

      return (
        <Flex.Row>
          <Box flex="0 0 50%">
            <Banner flowId="flow_ZZ6Fz6nt" />
          </Box>
          <Box flex="0 0 50%" marginLeft="auto">
            {showLateBanner && <Banner flowId="flow_gY36aLgO" />}
          </Box>
        </Flex.Row>
      );
    },
  ],
};
