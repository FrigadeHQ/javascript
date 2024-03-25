import { Announcement, useFlow, useFrigade } from "@frigade/react";

export default {
  title: "Components/Announcement",
  component: Announcement,
};

export const Default = {
  args: {
    dismissible: true,
    flowId: "flow_cvWFczn1RMHp9ZcK",
    modal: true,
    onDismiss: () => console.log("Dismissed"),
  },
};

export const TestReset = {
  args: {
    dismissible: true,
    flowId: "flow_cvWFczn1RMHp9ZcK",
  },
  decorators: [
    (Story, { args }) => {
      const { frigade } = useFrigade();
      const { flow } = useFlow(args.flowId);

      return (
        <div>
          <Story {...args} />
          <button
            onClick={async () => {
              // const flow = await frigade.getFlow(args.flowId);
              await flow.restart();
              await flow.reload();
              console.log("FLOW IN STORY: ", flow);
            }}
          >
            Reset flow
          </button>
        </div>
      );
    },
  ],
};
