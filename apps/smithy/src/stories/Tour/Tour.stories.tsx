import { TourProps } from "@/components/Tour/TourV2";
import { Box, Button, Tour, TourV2 } from "@frigade/react";
import { StoryContext, StoryFn } from "@storybook/react";

export default {
  title: "Components/Tour",
  component: Tour,
};

export const Default = {
  args: {
    dismissible: true,
    defaultOpen: false,
    spotlight: false,
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

export const TourV2NiceGreatYay = {
  args: {
    // dismissible: true,
    // defaultOpen: true,
    flowId: "flow_U63A5pndRrvCwxNs",
    modal: false,
    sequential: false,
    side: "left",
    spotlight: false,
    variables: {
      firstName: "Euronymous Bosch",
    },
  },
  decorators: [
    (_: StoryFn, options: StoryContext) => {
      // const [open, setOpen] = useState(true);
      // const { flow } = useFlow("flow_U63A5pndRrvCwxNs");

      return (
        <Box
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "calc(100vh - 32px)",
            // height: "1500px",
          }}
        >
          <input
            value="Restart Flow"
            type="button"
            onClick={() => {
              // Do nothing, this is just to see if you can interact outside the overlay
            }}
          />
          <Box
            borderRadius="10px"
            id="tooltip-storybook-0"
            p={4}
            style={{ background: "pink", width: "200px" }}
          >
            <Button.Primary
              title="Anchor here"
              onClick={() => {
                // no-op
              }}
            />
          </Box>
          <Box
            id="tooltip-storybook-1"
            p={4}
            style={{ background: "fuchsia", width: "200px" }}
          >
            Second anchor
          </Box>
          <TourV2
            // onOpenChange={setOpen}
            // open={open}
            // variables={{
            //   firstName: "John",
            // }}
            {...(options.args as TourProps)}
          />
        </Box>
      );
    },
  ],
};
