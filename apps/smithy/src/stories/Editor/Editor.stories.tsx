import { Editor, TemplateFlow } from "@frigade/react";
import { type Meta } from "@storybook/react";

export default {
  title: "Components/Editor",
  component: Editor,
} as Meta<typeof Editor>;

export const Default = {
  args: {
    // nada
  },
};

export const FlowTemplate = {
  decorators: [
    () => {
      return <TemplateFlow flowId="flow_xw9xq7yc" />;
    },
  ],
};
