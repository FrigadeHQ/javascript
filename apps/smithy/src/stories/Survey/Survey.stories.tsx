import { Box, Survey } from "@frigade/react";
import { StoryContext, StoryFn } from "@storybook/react";

export default {
  title: "Components/Survey",
  component: Survey.NPS,
};

export const NPS = {
  args: {
    dismissible: true,
  },
  decorators: [
    (_: StoryFn, options: StoryContext) => {
      return (
        <Box fontFamily="Arial">
          <Box backgroundColor="blue" height="500px">
            Other elements on the page
            <Survey.NPS
              flowId="flow_SJjL59eSt9A112vJ"
              alignSelf="flex-end"
              justifySelf="flex-end"
              {...options.args}
            />
          </Box>
        </Box>
      );
    },
  ],
};
