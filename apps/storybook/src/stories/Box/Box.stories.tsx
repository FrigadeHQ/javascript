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
  args: {
    children: "Hello",
    color: "blue500",
    bgColor: "green500",
    padding: "4",
  },
  decorators: [
    (Story: any) => (
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
          internal styles
        </Box>
      </>
    ),
  ],
};
