import { Box, Tour, useFlow } from "@frigade/react";
import { StoryContext, StoryFn } from "@storybook/react";
import { useEffect, useState } from "react";

export default {
  title: "Components/Tour",
  component: Tour,
};

export const Default = {
  args: {
    dismissible: true,
  },
  decorators: [
    (_: StoryFn, options: StoryContext) => {
      const [name, setName] = useState<string>();
      const { flow } = useFlow("flow_U63A5pndRrvCwxNs");

      useEffect(() => {
        setTimeout(() => {
          setName("Smeagol");
        }, 150);
      }, []);

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
          <input
            value="Restart Flow"
            type="button"
            onClick={() => {
              flow?.restart();
            }}
          />
          <Box
            id="tooltip-storybook-0"
            p={4}
            style={{ background: "pink", width: "20vw" }}
          >
            Anchor here
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
            onComplete={(flow) => console.log("COMPLETE", flow)}
            variables={{
              firstName: name,
            }}
            // spotlight={true}
            {...options.args}
            onPrimary={() => {
              // change url without redirecdt to be current url plus /new-url
              window.history.pushState({}, "", "/new-url");
            }}
          />
        </Box>
      );
    },
  ],
};
