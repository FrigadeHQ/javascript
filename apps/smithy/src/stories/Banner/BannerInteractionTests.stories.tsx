import { Banner, useFlow } from "@frigade/react";
import { type Meta, type StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";

type BannerStory = StoryObj<typeof Banner>;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const StoryMeta: Meta<typeof Banner> = {
  title: "Components/Banner",
  component: Banner,
};

export default StoryMeta;

export const InteractionTests: BannerStory = {
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
            id="reset-flow"
            onClick={() => {
              flow.restart();
            }}
            style={{ marginTop: "36px" }}
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

    await step("Test interactions", async () => {
      await userEvent.click(
        banner.getByRole("button", { name: "Primary CTA" })
      );

      await waitFor(async () => {
        await expect(bannerElement).not.toBeInTheDocument();
      });

      await sleep(1000);

      await userEvent.click(canvas.getByText("Reset Flow"));
    });
  },
};
