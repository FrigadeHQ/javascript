import { Banner, Flex } from "@frigade/react";

export default {
  title: "Rules/Rule Order",
  component: Banner,
};

export const RuleOrder = {
  args: {
    dismissible: true,
  },
  decorators: [
    () => {
      const BANNER_A = "flow_EwYzCB3L";
      const BANNER_B = "flow_pOKjjTpK";
      const BANNER_C = "flow_OZnHuyDE";
      const BANNER_D = "flow_hc5JiHDq";
      const BANNER_E = "flow_Ch5CvyoS";

      return (
        <Flex.Row>
          <Banner flowId={BANNER_A} />
          <Banner flowId={BANNER_B} />
          <Banner flowId={BANNER_C} />
          <Banner flowId={BANNER_D} />
          <Banner flowId={BANNER_E} />
        </Flex.Row>
      );
    },
  ],
};
