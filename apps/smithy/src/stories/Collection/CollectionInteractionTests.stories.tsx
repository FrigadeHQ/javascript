import { Text, Button, Collection, Flex, useFlow } from "@frigade/react";
import { type Meta, type StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { useEffect, useRef, useState } from "react";

type CollectionStory = StoryObj<typeof Collection>;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const StoryMeta: Meta<typeof Collection> = {
  title: "Components/Collection",
  component: Collection,
};

export default StoryMeta;

export const InteractionTests: CollectionStory = {
  args: {
    flowId: "flow_sXqeX8oN",
  },

  decorators: [
    (Story, { args }) => {
      const { flow } = useFlow(args.flowId);
      const originalUrl = useRef(window.location.href);
      const [url, setUrl] = useState(window.location.href);
      useEffect(() => {
        const handleNavigation = () => {
          setUrl(window.location.href);
        };

        // Listen for popstate event (back/forward navigation)
        window.addEventListener("popstate", handleNavigation);

        // Create a custom event for pushState and replaceState
        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;

        window.history.pushState = function (...args) {
          originalPushState.apply(this, args);
          window.dispatchEvent(new Event("locationchange"));
        };

        window.history.replaceState = function (...args) {
          originalReplaceState.apply(this, args);
          window.dispatchEvent(new Event("locationchange"));
        };

        // Listen for our custom locationchange event
        window.addEventListener("locationchange", handleNavigation);

        return () => {
          window.removeEventListener("popstate", handleNavigation);
          window.removeEventListener("locationchange", handleNavigation);
          window.history.pushState = originalPushState;
          window.history.replaceState = originalReplaceState;
        };
      }, []);

      return (
        <Flex.Column gap={2}>
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
          <Text.Body2>
            Make sure to enable the default collection in the provider to use
            this story
          </Text.Body2>
          <Text.Body2>Current URL: {url}</Text.Body2>
          <Button.Primary
            onClick={() => {
              window.history.pushState({}, "", "/url-targeting");
            }}
          >
            Go to URL
          </Button.Primary>
          <Button.Primary
            onClick={() => {
              window.history.pushState({}, "", originalUrl.current);
            }}
          >
            Go back to original URL
          </Button.Primary>
        </Flex.Column>
      );
    },
  ],

  play: async ({ step }) => {
    const originalUrl = window.location.href;

    await step(
      "Test that the default collection can render url-based announcement",
      async () => {
        const canvas = within(document.body);
        await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();

        await userEvent.click(
          canvas.getByRole("button", {
            name: "Go to URL",
          })
        );
        await sleep(200);

        const CollectionAnnouncementElement = await canvas.findByRole("dialog");

        await waitFor(async () => {
          await expect(CollectionAnnouncementElement).toBeInTheDocument();
        });

        window.history.pushState({}, "", originalUrl);

        await sleep(300);

        await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();

        await userEvent.click(canvas.getByText("Reset Flow"));

        await sleep(1000);
      }
    );
  },
};
