import { Box, Text } from "@frigade/reactv2";

export default {
  title: "Design System/Text",
  component: Text,
};

export const Default = {
  decorators: [
    () => (
      <Box style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {[
          "Display1",
          "Display2",
          "H1",
          "H2",
          "H3",
          "H4",
          "Body1",
          "Body2",
          "Caption",
        ].map((variant) => {
          const Component = Text[variant];
          return <Component key={variant}>{`Text.${variant}`}</Component>;
        })}
      </Box>
    ),
  ],
};
