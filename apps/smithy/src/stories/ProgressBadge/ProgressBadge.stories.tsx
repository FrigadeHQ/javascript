import { ProgressBadge } from "@frigade/react";

export default {
  title: "Components/ProgressBadge",
  component: ProgressBadge,
};

export const Default = {
  args: {
    display: "inline-block",
    flowId: "flow_ArnxGil9",
    onClick: () => {
      console.log("Clicked ProgressBadge");
    },
    title: null,
  },
};
