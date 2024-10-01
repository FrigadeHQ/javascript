import { Checklist, useFlow } from "@frigade/react";
import { type Meta, type StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";

type ChecklistStory = StoryObj<typeof Checklist>;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const StoryMeta: Meta<typeof Checklist.Collapsible> = {
  title: "Components/Checklist",
  component: Checklist.Collapsible,
};

export default StoryMeta;

export const InteractionTests: ChecklistStory = {
  args: {
    flowId: "flow_K2dmIlteW8eGbGoo",
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
              flow?.restart();
            }}
            style={{ marginTop: "36px" }}
          >
            Reset Flow
          </button>
        </>
      );
    },
  ],

  play: async ({ step, canvasElement }) => {
    await sleep(1000);
    const canvas = within(canvasElement);
    const checklistElement = document.querySelector(".fr-checklist");

    await step("Test interactions", async () => {
      // test that checklistElement is in the document
      expect(checklistElement).toBeInTheDocument();

      const lastHeader = canvas.getByText("Donec id diam lectus");
      let checkboxes = document.querySelectorAll(".fr-field-radio-value");

      // expectd lastCheckbox to not have any children
      expect(checkboxes[checkboxes.length - 1]?.childNodes.length).toBe(0);
      // click last header
      await userEvent.click(lastHeader);
      // Click the primary button that says "Testing"
      await userEvent.click(canvas.getByText("Testing"));
      await sleep(100);

      checkboxes = document.querySelectorAll(".fr-field-radio-value");
      // expect lastCheckbox to have a child (it is checked)
      expect(
        checkboxes[checkboxes.length - 1]?.childNodes.length
      ).toBeGreaterThanOrEqual(1);
      await sleep(1000);
      expect(checklistElement).toBeInTheDocument();

      await userEvent.click(canvas.getByText("Reset Flow"));
    });
  },
};
