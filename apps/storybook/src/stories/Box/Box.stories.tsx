import { Box, sprinkles, Text } from "@frigade/reactv2";
import { Meta } from "@storybook/react";

export default {
  title: "Components/Box",
  component: Box,
} as Meta<typeof Box>;

export const Default = {
  args: {
    children: (
      <Text>This is a Box. It accepts all of our Sprinkles props:</Text>
    ),
  },
};

export const Polymorphism = {
  args: {
    as: "ul",
    children: (
      <Text as="li">
        Box accepts an `as` prop, which will render the Box as the provided
        component (or HTML element). This Box is actually a UL, and the Text
        inside it is an LI!
      </Text>
    ),
  },
};

export const TEMP_Playground = {
  decorators: [
    () => {
      return (
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
      );
    },
  ],
};
