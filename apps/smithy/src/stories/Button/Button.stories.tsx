import { Box, Button } from "@frigade/react";

export default {
  title: "Design System/Button",
  component: Button,
};

export const Default = {
  args: {
    title: "Hello button",
  },
};

export const WithChildren = {
  args: {
    title: "Hello button",
    children: <img src="https://placekitten.com/24/24" />,
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
