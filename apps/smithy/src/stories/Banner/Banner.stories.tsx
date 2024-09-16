import { Banner, useFlow } from "@frigade/react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";

type BannerStory = StoryObj<typeof Banner>;

export default {
  title: "Components/Banner",
  component: Banner,
} as Meta<typeof Banner>;

export const Default: BannerStory = {
  args: {
    dismissible: true,
    flowId: "flow_ZacoWhZhzqbdHQ8k",
  },
};

export const Tests: BannerStory = {
  args: {
    dismissible: true,
    flowId: "flow_ZacoWhZhzqbdHQ8k",
  },

  decorators: [
    (Story, { args }) => {
      const { flow } = useFlow(args.flowId);

      return (
        <>
          <Story {...args} />
          <button
            onClick={() => {
              flow.restart();
            }}
          >
            Reset Flow
          </button>
        </>
      );
    },
  ],

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const bannerElement = await canvas.findByRole("complementary", {
      name: "Banner",
    });
    const banner = within(bannerElement);

    expect(bannerElement).toBeInTheDocument();

    await step("Check Banner contents", async () => {
      expect(
        banner.getByRole("heading", { name: "Banner title" })
      ).toBeVisible();

      // TODO: Add a11y attributes to subtitle
      expect(banner.getByText("Banner subtitle")).toBeVisible();

      // TODO: Add a11y attributes to image
      expect(banner.getByRole("img")).toBeVisible();

      expect(banner.getByRole("button", { name: "Primary CTA" })).toBeVisible();

      expect(
        banner.getByRole("button", { name: "Secondary CTA" })
      ).toBeVisible();

      expect(banner.getByRole("button", { name: "Dismiss" })).toBeVisible();
    });

    // Check that stable classnames unique to this component exist in the DOM
    await step("Check SDK classnames", async () => {
      expect(canvasElement.querySelector(".fr-banner")).toBeInTheDocument();

      expect(
        canvasElement.querySelector(".fr-banner-title-wrapper")
      ).toBeInTheDocument();
    });

    await step("Test interactions", async () => {
      await userEvent.click(
        banner.getByRole("button", { name: "Primary CTA" })
      );

      await waitFor(() => {
        expect(bannerElement).not.toBeInTheDocument();
      });

      // await userEvent.click(canvas.getByText("Reset Flow"));
    });
  },
};
