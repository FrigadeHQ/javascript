import { Banner } from "@frigade/react";

export default {
  title: "Components/Banner",
  component: Banner,
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
    flowId: "flow_ZacoWhZhzqbdHQ8k",
  },
};
