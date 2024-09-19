import { Box, Button, Tour, TourProps, useFlow } from "@frigade/react";
import { type Meta, type StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { useEffect, useRef } from "react";

type TourStory = StoryObj<typeof Tour>;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const StoryMeta: Meta<typeof Tour> = {
  title: "Components/Tour",
  component: Tour,
};

export default StoryMeta;

export const InteractionTests: TourStory = {
  args: {
    flowId: "flow_U63A5pndRrvCwxNs",
  },

  decorators: [
    (Story, { args }) => {
      const { flow } = useFlow(args.flowId);

      const lateAnchorRef = useRef(null);

      useEffect(() => {
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
      }, []);

      return (
        <>
          <Story {...args} />
          <button
            id="reset-flow"
            onClick={() => {
              flow.restart();
            }}
            style={{ marginTop: "36px" }}
          >
            Reset Flow
          </button>
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
          </Box>

          <Box
            id="tooltip-storybook-2"
            p={4}
            style={{
              background: "lightgreen",
              width: "200px",
              marginTop: "1400px", // Add significant margin to force scrolling
            }}
          >
            Scroll to see this anchor
          </Box>
        </>
      );
    },
  ],

  play: async ({ step }) => {
    await step("Test paginating through the Tour", async () => {
      const canvas = within(document.body);
      let TourElement = await canvas.findByRole("dialog");
      let Tour = within(TourElement);

      await userEvent.click(Tour.getByRole("button", { name: "Let's go!" }));
      await sleep(100);

      TourElement = await canvas.findByRole("dialog");
      Tour = within(TourElement);

      await userEvent.click(
        Tour.getByRole("button", { name: "Scroll to the next step" })
      );

      await sleep(100);

      TourElement = await canvas.findByRole("dialog");
      Tour = within(TourElement);

      await userEvent.click(Tour.getByRole("button", { name: "Continue" }));

      await sleep(100);

      await waitFor(async () => {
        await expect(TourElement).not.toBeInTheDocument();
      });

      await sleep(1000);

      await userEvent.click(canvas.getByText("Reset Flow"));

      await sleep(1000);
    });
  },
};
