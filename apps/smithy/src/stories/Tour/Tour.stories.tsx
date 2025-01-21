import { Box, Button, Tour, type TourProps } from "@frigade/react";
import { StoryContext, StoryFn } from "@storybook/react";
import { useEffect, useRef, useState } from "react";

export default {
  title: "Components/Tour",
  component: Tour,
};

export const Default = {
  args: {
    align: "after",
    dismissible: true,
    defaultOpen: true,
    flowId: "flow_U63A5pndRrvCwxNs",
    modal: false,
    sequential: true,
    side: "left",
    spotlight: false,
    variables: {
      firstName: "Euronymous Bosch",
    },
  },
  decorators: [
    (_: StoryFn, options: StoryContext) => {
      const [, setForceRender] = useState(Math.random());
      const [open, setOpen] = useState(true);
      // const { flow } = useFlow("flow_U63A5pndRrvCwxNs");

      const lateAnchorRef = useRef(null);

      useEffect(() => {
        setTimeout(() => {
          // @ts-expect-error Shush TypeScript, it's a debug ref in a story, it's fine
          lateAnchorRef.current = (
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
          );

          setForceRender(Math.random());
        }, 333);
      }, []);

      return (
        <>
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

            {lateAnchorRef.current}

            <Box
              id="tooltip-storybook-1"
              p={4}
              style={{ background: "fuchsia", width: "200px" }}
            >
              Second anchor
            </Box>
            <Tour
              onOpenChange={setOpen}
              open={open}
              // variables={{
              //   firstName: "John",
              // }}
              onSecondary={() => setOpen(false)}
              {...(options.args as TourProps)}
            />
          </Box>

          <Box
            id="tooltip-storybook-2"
            p={4}
            style={{
              background: "lightgreen",
              width: "200px",
              marginTop: "200vh", // Add significant margin to force scrolling
            }}
          >
            Scroll to see this anchor
          </Box>
        </>
      );
    },
  ],
};

export const AnchorNotFound = {
  args: {
    autoScroll: true,
    flowId: "flow_U63A5pndRrvCwxNs",
    defaultOpen: true,
  },
  decorators: [
    (_: StoryFn, options: StoryContext) => {
      return (
        <>
          <Box
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "calc(100vh - 32px)",
            }}
          >
            <Box
              borderRadius="10px"
              id="tooltip-storybook-nonexistent"
              p={4}
              style={{ background: "red", width: "200px" }}
            >
              <Button.Primary
                title="Non-existent Anchor"
                onClick={() => {
                  // no-op
                }}
              />
            </Box>
            <Tour {...(options.args as TourProps)} />
          </Box>
        </>
      );
    },
  ],
};

export const WithScrollContainer = {
  args: {
    autoScroll: true,
    container: "#tour-scroll-container",
    flowId: "flow_U63A5pndRrvCwxNs",
    modal: false,
    spotlight: false,
    variables: {
      firstName: "Euronymous Bosch",
    },
  },
  decorators: [
    (_: StoryFn, options: StoryContext) => {
      return (
        <>
          <Box
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "calc(100vh - 32px)",
            }}
          >
            <Box
              backgroundColor="neutral.900"
              height="50vw"
              id="tour-scroll-container"
              overflow="scroll"
              padding="2"
              position="relative"
              width="50vw"
            >
              <Box height="300vh">
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

                <Box
                  id="tooltip-storybook-2"
                  p={4}
                  style={{
                    background: "lightgreen",
                    width: "200px",
                    marginTop: "200vh", // Add significant margin to force scrolling
                  }}
                >
                  Scroll to see this anchor
                </Box>
                <Tour {...(options.args as TourProps)} />
              </Box>
            </Box>
          </Box>
        </>
      );
    },
  ],
};
