import { Banner } from "@frigade/react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";

export type BannerStory = StoryObj<typeof Banner>;

export default {
  title: "Components/Banner",
  component: Banner,
} as Meta<typeof Banner>;

export const Default: BannerStory = {
  args: {
    flowId: "flow_ZacoWhZhzqbdHQ8k",
  },

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
    });

    // Check that stable classnames unique to this component exist in the DOM
    await step("Check SDK classnames", async () => {
      expect(canvasElement.querySelector(".fr-banner")).toBeInTheDocument();

      expect(
        canvasElement.querySelector(".fr-banner-title-wrapper")
      ).toBeInTheDocument();
    });
  },
};

export const Dismissible: BannerStory = {
  args: {
    dismissible: true,
    flowId: "flow_ZacoWhZhzqbdHQ8k",
  },

  play: async (context) => {
    const { canvasElement, step } = context;

    console.log("CONTEXT: ", context);

    const canvas = within(canvasElement);
    const bannerElement = await canvas.findByRole("complementary", {
      name: "Banner",
    });
    const banner = within(bannerElement);

    await Default.play?.(context);

    await step("Check dismissible state", async () => {
      expect(banner.getByRole("button", { name: "Dismiss" })).toBeVisible();
    });
  },
};
