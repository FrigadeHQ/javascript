import { Box, Button, Form, useFlow } from "@frigade/react";
import { type Meta, type StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { useEffect, useRef } from "react";

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
    await step("Test branching of Form", async () => {
      const canvas = within(document.body);
      await canvas.findByText("This is page 1");

      // click on thing that says Go to page 2
      await userEvent.click(canvas.getByText("Continue to page 2"));

      // Click on Next button
      await userEvent.click(canvas.getByText("Next"));

      // look for text that says "This is page 2"
      await canvas.findByText("This is page 2");

      // click Next
      await userEvent.click(canvas.getByText("Next"));

      // look for text that says "This is page 3"
      await canvas.findByText("This is page 3");

      // expect button that says Finish to be disabled
      await sleep(100);
      await expect(canvas.getByText("Finish").closest("button")).toBeDisabled();

      // click on Radio 1
      await userEvent.click(canvas.getByText("Radio 1"));
      // click Next
      await userEvent.click(canvas.getByText("Finish"));

      await sleep(500);
      // check that .fr-form is gone
      await expect(document.querySelector(".fr-form")).not.toBeInTheDocument();

      await userEvent.click(canvas.getByText("Reset Flow"));

      await sleep(1000);
    });
  },
};
