import { Box, Button, Survey } from "@frigade/react";
import { StoryContext, StoryFn } from "@storybook/react";

export default {
  title: "Components/Survey",
  component: Survey.NPS,
};

export const NPS = {
  args: {
    flowId: "flow_SJjL59eSt9A112vJ",
    dismissible: true,
    options: [
      { label: "😞", value: "0" },
      { label: "😕", value: "1" },
      { label: "😐", value: "2" },
      { label: "🙂", value: "3" },
      { label: "😍", value: "4" },
    ],
  },
  decorators: [
    (_: StoryFn, options: StoryContext) => {
      return (
        <Box fontFamily="Arial">
          <Box height="500px">
            Other elements on the page
            <Button.Primary
              onClick={() => {
                window.history.pushState({}, "", "/new-url");
              }}
            >
              Change url
            </Button.Primary>
            <Survey.NPS
              flowId={options.args.flowId as string}
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
