import { Banner } from "@frigade/react";

export default {
  title: "Components/Banner",
  component: Banner,
};

export const Default = {
  args: {
    dismissible: true,
    flowId: "flow_ZacoWhZhzqbdHQ8k",
    onPrimary: () => {
      console.log("Primary button clicked");
      return false;
    },
  },
};
