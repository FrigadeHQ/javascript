import { Box } from "@frigade/reactv2";

import "@frigade/reactv2/css";

export default {
  title: "Components/Box",
  component: Box,
};

export const Default = {
  args: {
    children: "This is a Box. It accepts all of our Sprinkles props",
    color: "blue500",
    bgColor: "green500",
    padding: "4",
  },
};

export const Classnames = {
  decorators: [
    () => (
      <>
        <style>
          {`
          .testing {
            color: pink;
          }
          `}
        </style>
        <Box color="blue500" className="testing">
          Box will prioritize styles from the `className` prop over its own
          internal styles.
        </Box>
      </>
    ),
  ],
};

export const Playground = {
  decorators: [
    () => (
      <>
        <style>
          {`
          .testing {
            color: pink;
          }
          `}
        </style>
        Messing around with this dang box while we work:
        <Box color="blue500" className="testing" style={{ color: "green" }}>
          Box will prioritize styles from the `className` prop over its own
          internal styles.
        </Box>
      </>
    ),
  ],
};
