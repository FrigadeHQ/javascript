import { Box, Button, Tour } from "@frigade/react";
import { StoryContext, StoryFn } from "@storybook/react";

export default {
  title: "Components/Tour",
  component: Tour,
};

export const Default = {
  args: {
    dismissible: true,
    defaultOpen: false,
  },
  decorators: [
    (_: StoryFn, options: StoryContext) => {
      return (
        <Box
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "calc(100vh - 32px)",
          }}
        >
          <input value="Restart Flow" type="button" />
          <Box
            id="tooltip-storybook-0"
            p={4}
            style={{ background: "pink", width: "20vw" }}
          >
            <Button.Primary title="Anchor here" />
          </Box>
          <Box
            id="tooltip-storybook-1"
            p={4}
            style={{ background: "fuchsia", width: "20vw" }}
          >
            Second anchor
          </Box>
          <Tour
            flowId="flow_U63A5pndRrvCwxNs"
            variables={{
              firstName: "John",
            }}
            {...options.args}
          />
        </Box>
      );
    },
  ],
};
