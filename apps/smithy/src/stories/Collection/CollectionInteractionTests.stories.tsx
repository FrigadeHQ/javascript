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
    announcementFlowId: "flow_sXqeX8oN",
    bannerFlowId: "flow_ZacoWhZhzqbdHQ8k",
    cardFlowId: "flow_xw9xq7yc",
  },

  decorators: [
    (Story, { args }) => {
      const { flow: announcementFlow } = useFlow(args.announcementFlowId);
      const { flow: bannerFlow } = useFlow(args.bannerFlowId);
      const { flow: cardFlow } = useFlow(args.cardFlowId);

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
          <Collection collectionId="collection_84G6gzEL" />
          <button
            id="reset-flow"
            onClick={async () => {
              await Promise.all([
                announcementFlow.restart(),
                bannerFlow.restart(),
                cardFlow.restart(),
              ]);
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

  play: async ({ step, canvasElement }) => {
    const originalUrl = window.location.href;

    await step(
      "Test that the default collection can render url-based announcement",
      async () => {
        const canvas = within(document.body);
        await sleep(300);
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

        await sleep(300);
      }
    );

    await step("Test that cooloffs are respected", async () => {
      const canvas = within(canvasElement);
      const bannerElement = await canvas.findByRole("complementary", {
        name: "Banner",
      });
      const banner = within(bannerElement);

      // expect banner to be in the document
      await expect(bannerElement).toBeInTheDocument();

      // expect banner to contain the text "Banner title"
      await expect(banner.getByText("Banner title")).toBeInTheDocument();

      // Click button with Primary CTA
      await userEvent.click(
        banner.getByRole("button", {
          name: "Primary CTA",
        })
      );

      await sleep(1000);

      // banner is now gone
      await expect(bannerElement).not.toBeInTheDocument();

      await sleep(200);

      // look for a an element with the class fr-card
      let card = document.querySelector(".fr-card");
      await expect(card).not.toBeInTheDocument();
      // change the url to trigger a provider reload
      window.history.pushState({}, "", "/some-url");
      await sleep(500);
      card = document.querySelector(".fr-card");
      await expect(card).not.toBeInTheDocument();
      await sleep(5500);
      // change the url to trigger a provider reload
      window.history.pushState({}, "", "/some-other-url");
      await sleep(1000);
      card = document.querySelector(".fr-card");
      await expect(card).toBeInTheDocument();
    });

    await step("Reset all flows", async () => {
      const canvas = within(canvasElement);
      await userEvent.click(canvas.getByText("Reset Flow"));
      await sleep(1000);
    });
  },
};
