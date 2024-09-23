import { ProgressBadge } from "@frigade/react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";

export default {
  title: "Components/ProgressBadge",
  component: ProgressBadge,
} as Meta<typeof ProgressBadge>;

export const Default: StoryObj<typeof ProgressBadge> = {
  args: {
    display: "inline-block",
    flowId: "flow_1Tbh8w1l",
    // title: "Override ProgressBadge title",
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const progressBadgeElement = await canvas.findByRole("complementary", {
      name: "Progress Badge",
    });
    const progressBadge = within(progressBadgeElement);

    expect(progressBadgeElement).toBeInTheDocument();

    await step("Check ProgressBadge contents", async () => {
      expect(
        progressBadge.getByRole("heading", { name: "Card title" })
      ).toBeVisible();

      expect(
        progressBadge.getByRole("meter", { name: "Progress Fraction" })
      ).toBeVisible();

      expect(
        progressBadge.getByRole("meter", { name: "Progress Fraction" })
      ).toBeVisible();
    });

    // Check that stable classnames unique to this component exist in the DOM
    await step("Check SDK classnames", async () => {
      expect(
        canvasElement.querySelector(".fr-progress-badge")
      ).toBeInTheDocument();

      expect(
        canvasElement.querySelector(".fr-progress-badge-header")
      ).toBeInTheDocument();

      expect(
        canvasElement.querySelector(".fr-progress-badge-footer")
      ).toBeInTheDocument();
    });
  },
};

// Addt'l story for title override
