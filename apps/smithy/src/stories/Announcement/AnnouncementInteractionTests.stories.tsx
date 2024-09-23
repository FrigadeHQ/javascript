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
    await step("Test paginating through the announcement", async () => {
      await sleep(500);
      const canvas = within(document.body);
      const AnnouncementElement = await canvas.findByRole("dialog");
      const Announcement = within(AnnouncementElement);

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

      await sleep(1000);
    });

    await step(
      "Test navigating back and forth in an announcement",
      async () => {
        const canvas = within(document.body);
        const AnnouncementElement = await canvas.findByRole("dialog");
        const Announcement = within(AnnouncementElement);

        await userEvent.click(
          Announcement.getByRole("button", { name: "Next" })
        );
        await sleep(100);
        await userEvent.click(
          Announcement.getByRole("button", { name: "Back" })
        );
        await userEvent.click(
          Announcement.getByRole("button", { name: "Next" })
        );
        await sleep(100);
        await userEvent.click(
          Announcement.getByRole("button", { name: "Finish" })
        );
        await sleep(100);

        await waitFor(async () => {
          await expect(AnnouncementElement).not.toBeInTheDocument();
        });

        await sleep(1000);

        await userEvent.click(canvas.getByText("Reset Flow"));

        await sleep(1000);
      }
    );

    await step("Test dismissing the announcement", async () => {
      const canvas = within(document.body);
      const AnnouncementElement = await canvas.findByRole("dialog");

      await expect(AnnouncementElement).toBeInTheDocument();

      const dismissButton = document.querySelector(".fr-close");
      await userEvent.click(dismissButton as HTMLElement);

      await waitFor(async () => {
        await expect(AnnouncementElement).not.toBeInTheDocument();
      });

      await sleep(1000);

      await userEvent.click(canvas.getByText("Reset Flow"));
    });
  },
};
