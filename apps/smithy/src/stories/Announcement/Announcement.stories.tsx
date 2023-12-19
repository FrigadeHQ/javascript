import { Announcement } from "@frigade/reactv2";

export default {
  title: "Components/Announcement",
  component: Announcement,
};

export const Default = {
  args: {
    flowId: "flow_cvWFczn1RMHp9ZcK",
    onPrimary: (step, e) => console.log(step, e),
  },
};
