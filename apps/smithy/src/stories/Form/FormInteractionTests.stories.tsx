import { Form, useFlow } from "@frigade/react";
import { type Meta, type StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";

type FormStory = StoryObj<typeof Form>;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const StoryMeta: Meta<typeof Form> = {
  title: "Components/Form",
  component: Form,
};

export default StoryMeta;

export const InteractionTests: FormStory = {
  args: {
    flowId: "flow_fpJlqkbl",
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
    await step("Test linear flow of Form", async () => {
      const canvas = within(document.body);
      await sleep(500);
      await canvas.findByText("This is page 1");
      await userEvent.click(canvas.getByText("Continue to page 2"));
      await userEvent.click(canvas.getByText("Next"));
      await canvas.findByText("This is page 2");
      await userEvent.click(canvas.getByText("Next"));
      await canvas.findByText("This is page 3");
      await sleep(100);
      await expect(canvas.getByText("Finish").closest("button")).toBeDisabled();
      await userEvent.click(canvas.getByText("Radio 1"));
      await userEvent.click(canvas.getByText("Finish"));
      await sleep(500);
      await expect(document.querySelector(".fr-form")).not.toBeInTheDocument();
      await userEvent.click(canvas.getByText("Reset Flow"));
      await sleep(1000);
    });

    // create a similar test to above but where you click Go to page 3 in the first page
    await step("Test branching of Form", async () => {
      const canvas = within(document.body);
      await canvas.findByText("This is page 1");
      await userEvent.click(canvas.getByText("Go to page 3"));
      await userEvent.click(canvas.getByText("Next"));
      await canvas.findByText("This is page 3");
      await userEvent.click(canvas.getByText("Radio 1"));
      await userEvent.click(canvas.getByText("Finish"));
      await sleep(500);
      await expect(document.querySelector(".fr-form")).not.toBeInTheDocument();
      await userEvent.click(canvas.getByText("Reset Flow"));
      await sleep(1000);
      await userEvent.click(canvas.getByText("Reset Flow"));
      await sleep(1000);
    });

    // test navigating back and forth 3 times between step 1 and 2
    await step(
      "Test navigating back and forth 3 times between step 1 and 2",
      async () => {
        const canvas = within(document.body);

        for (let i = 0; i < 3; i++) {
          await canvas.findByText("This is page 1");
          await userEvent.click(canvas.getByText("Continue to page 2"));
          await userEvent.click(canvas.getByText("Next"));
          await canvas.findByText("This is page 2");
          await userEvent.click(canvas.getByText("Back"));
        }

        // now finish the flow
        await canvas.findByText("This is page 1");
        await userEvent.click(canvas.getByText("Continue to page 2"));
        await userEvent.click(canvas.getByText("Next"));
        await canvas.findByText("This is page 2");
        await userEvent.click(canvas.getByText("Next"));
        await canvas.findByText("This is page 3");
        await userEvent.click(canvas.getByText("Radio 1"));
        await userEvent.click(canvas.getByText("Finish"));
        await sleep(500);
        await expect(
          document.querySelector(".fr-form")
        ).not.toBeInTheDocument();

        await userEvent.click(canvas.getByText("Reset Flow"));
        await sleep(1000);
      }
    );
  },
};
