import { Banner, Flex } from "@frigade/react";

export default {
  title: "Rules/Three Banners",
  component: Banner,
};

export const ThreeBanners = {
  args: {
    dismissible: true,
  },
  decorators: [
    () => {
      const BANNER_A = "flow_EwYzCB3L";
      const BANNER_B = "flow_pOKjjTpK";
      const BANNER_C = "flow_OZnHuyDE";
      return (
        <Flex.Row>
          {/* <Banner flowId={BANNER_A} />
          <Banner flowId={BANNER_B} />
          <Banner flowId={BANNER_C} /> */}

          <Banner flowId={BANNER_A} />
          <Banner flowId={BANNER_B} />
          <Banner flowId={BANNER_C} />
        </Flex.Row>
      );
    },
  ],
};
