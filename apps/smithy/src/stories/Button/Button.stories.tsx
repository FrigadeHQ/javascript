import { Box, Button } from "@frigade/react";

const buttonVariants = ["Primary", "Secondary", "Link", "Plain"] as const;

export default {
  title: "Design System/Button",
  component: Button.Primary,
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
        {buttonVariants.map((variant) => {
          const Component = Button[variant];
          return <Component key={variant} title={`Button.${variant}`} />;
        })}
      </Box>
    ),
  ],
};
