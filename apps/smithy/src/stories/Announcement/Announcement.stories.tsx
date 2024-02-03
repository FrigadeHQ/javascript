import { Announcement } from "@frigade/reactv2";

export default {
  title: "Components/Announcement",
  component: Announcement,
  argTypes: {
    container: {
      type: "select",
      options: ["none", "dialog"],
    },
  },
};

export const Default = {
  args: {
    dismissible: true,
    flowId: "flow_cvWFczn1RMHp9ZcK",
  },
};
