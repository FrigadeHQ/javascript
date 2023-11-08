import { Box, Button, Text } from "@frigade/reactv2";

export default {
  title: "Components/Box",
  component: Box,
};

export const Default = {
  args: {
    children: <Text>This is a Box.</Text>,
  },
};

export const Polymorphism = {
  args: {
    as: "ul",
    children: (
      <>
        <Text as="li">
          Box accepts an `as` prop, which will render the Box as the provided
          component (or HTML element).
        </Text>
        <Text as="li">
          This Box is actually a UL, and the Text nodes inside it are LIs!
        </Text>
      </>
    ),
  },
};
