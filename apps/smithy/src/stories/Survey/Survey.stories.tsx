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
          </Box>
          <Survey.NPS
            flowId="flow_R7MOhuQ6FpjMQlan"
            align="bottom-right"
            fontFamily="Arial"
            {...options.args}
          />
        </Box>
      );
    },
  ],
};
