import {
  Box,
  Button,
  Dialog,
  Flex,
  Tooltip,
  type TooltipProps,
} from "@frigade/react";
import { StoryContext, StoryFn } from "@storybook/react";
import { useState } from "react";

export default {
  title: "Design System/Tooltip",
  component: Tooltip,
  argTypes: {
    align: {
      type: "select",
      options: ["before", "start", "center", "end", "after"],
    },
    alignOffset: {
      type: "number",
      default: 0,
    },
    side: {
      type: "select",
      options: ["top", "right", "bottom", "left"],
    },
    sideOffset: {
      type: "number",
      default: 0,
    },
  },
};

function TestTooltip(props: TooltipProps) {
  return (
    <Tooltip
      anchor="#tooltip-anchor"
      onOpenAutoFocus={(e) => e.preventDefault()}
      onPointerDownOutside={(e) => e.preventDefault()}
      onInteractOutside={(e) => e.preventDefault()}
      {...props}
    >
      <Tooltip.Close />

      <Tooltip.Media src="https://placehold.co/300x150" type="image" />

      <Flex.Column gap={1}>
        <Tooltip.Title>Title</Tooltip.Title>
        <Tooltip.Subtitle>Subtitle</Tooltip.Subtitle>
      </Flex.Column>

      <Flex.Row
        alignItems="center"
        gap={3}
        justifyContent="flex-end"
        part="tooltip-footer"
      >
        <Tooltip.Progress marginRight="auto">0/0</Tooltip.Progress>

        <Tooltip.Secondary title="Secondary" />
        <Tooltip.Primary title="Primary" />
      </Flex.Row>
    </Tooltip>
  );
}

export const Default = {
  args: {
    align: "after",
    alignOffset: 0,
    side: "bottom",
    sideOffset: 0,
    spotlight: false,
  },
  decorators: [
    (_: StoryFn, options: StoryContext) => (
      <Box
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "calc(100vh - 32px)",
        }}
      >
        <Box p={4} style={{ background: "pink", width: "20vw" }}>
          Not the anchor
        </Box>
        <Box
          id="tooltip-anchor"
          p={4}
          borderRadius="md"
          style={{ background: "#f0f0f0", width: "20vw" }}
        >
          Anchor here
        </Box>
        <Box p={4} style={{ background: "fuchsia", width: "20vw" }}>
          Also not the anchor
        </Box>

        <TestTooltip {...options.args} />
      </Box>
    ),
  ],
};

export const Mutations = {
  args: {
    align: "after",
    alignOffset: 0,
    side: "bottom",
    sideOffset: 0,
    spotlight: false,
  },
  decorators: [
    (_: StoryFn, options: StoryContext) => {
      const [open, setOpen] = useState(false);

      return (
        <Box
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "calc(100vh - 32px)",
          }}
        >
          <Button.Primary
            title="Open dialog"
            onClick={() => {
              setOpen(!open);
            }}
          />

          <Dialog open={open}>
            <Dialog.Dismiss onClick={() => setOpen(false)} />
            <Dialog.Title id="tooltip-anchor">
              This is the anchor for the Tooltip
            </Dialog.Title>
          </Dialog>
          <TestTooltip {...options.args} />
        </Box>
      );
    },
  ],
};
