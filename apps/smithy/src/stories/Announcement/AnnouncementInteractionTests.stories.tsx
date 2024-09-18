import { Announcement, useFlow } from "@frigade/react";
import { type Meta, type StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";

type AnnouncementStory = StoryObj<typeof Announcement>;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const StoryMeta: Meta<typeof Announcement> = {
  title: "Components/Announcement",
  component: Announcement,
};

export default StoryMeta;

export const InteractionTests: AnnouncementStory = {
  args: {
    dismissible: true,
    flowId: "flow_8Ybz7lMK",
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

  play: async ({ step }) => {
    const canvas = within(document.body);
    const AnnouncementElement = await canvas.findByRole("dialog");
    const Announcement = within(AnnouncementElement);

    await step("Test interactions", async () => {
      await userEvent.click(Announcement.getByRole("button", { name: "Next" }));
      await sleep(100);
      await userEvent.click(
        Announcement.getByRole("button", { name: "Finish" })
      );

      await waitFor(async () => {
        await expect(AnnouncementElement).not.toBeInTheDocument();
      });

      await sleep(1000);

      await userEvent.click(canvas.getByText("Reset Flow"));
    });
  },
};
