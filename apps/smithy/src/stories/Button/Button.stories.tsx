import { Box, Button } from "@frigade/reactv2";

export default {
  title: "Design System/Button",
  component: Button,
};

export const Default = {
  args: {
    title: "Hello button",
  },
};

export const Variants = {
  decorators: [
    () => (
      <Box
        style={{ display: "inline-flex", flexDirection: "column", gap: "12px" }}
      >
        {Object.keys(Button).map((variant) => {
          const Component = Button[variant];
          return <Component key={variant} title={`Button.${variant}`} />;
        })}
      </Box>
    ),
  ],
};
