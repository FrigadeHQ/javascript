import { Box, Text } from "@frigade/reactv2";

export default {
  title: "Design System/Box",
  component: Box,
};

export const Default = {
  args: {
    // as: "img",
    // src: "http://placekitten.com/60/60",
    height: "60px",
    width: "60px",
    border: "1px solid fuchsia",
    "bg:hover": "orange",
  },
};

export const Polymorphism = {
  args: {
    as: "ul",
    children: (
      <>
        <Text.Body1 as="li">
          Box accepts an `as` prop, which will render the Box as the provided
          component (or HTML element).
        </Text.Body1>
        <Text.Body1 as="li">
          This Box is actually a UL, and the Text nodes inside it are LIs!
        </Text.Body1>
      </>
    ),
  },
};
