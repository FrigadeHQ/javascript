import { useEffect, useState } from "react";
import { Banner, Box, Flex } from "@frigade/react";
import { StoryContext, StoryFn } from "@storybook/react";

export default {
  title: "Rules/Late Registration",
  component: Banner,
};

export const LateRegistration = {
  args: {
    dismissible: true,
  },
  decorators: [
    (_: StoryFn, options: StoryContext) => {
      const [showLateBanner, setShowLateBanner] = useState(false);
      const [showLaterBanner, setShowLaterBanner] = useState(false);

      useEffect(() => {
        setTimeout(() => {
          setShowLateBanner(true);

          setTimeout(() => {
            setShowLaterBanner(true);
          }, 1000);
        }, 1000);
      }, []);

      return (
        <>
          <Flex.Row>
            <Box flex="0 0 50%">
              <Banner flowId="flow_ZZ6Fz6nt" />
            </Box>
            <Box flex="0 0 50%" marginLeft="auto">
              {showLateBanner && <Banner flowId="flow_gY36aLgO" />}
            </Box>
          </Flex.Row>
          {showLaterBanner && <Banner flowId="flow_pOKjjTpK" />}
        </>
      );
    },
  ],
};
