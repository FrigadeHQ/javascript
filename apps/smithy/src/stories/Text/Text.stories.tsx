import { Box, Text } from "@frigade/reactv2";

export default {
  title: "Components/Text",
  component: Text,
};

export const Default = {
  args: {
    children:
      "This is <Text>. It will render the <Text.Body1> variant by default.",
  },
};

export const Variants = {
  decorators: [
    () => (
      <Box style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {Object.keys(Text).map((variant) => {
          const Component = Text[variant];
          return <Component key={variant}>{`Text.${variant}`}</Component>;
        })}
      </Box>
    ),
  ],
};
