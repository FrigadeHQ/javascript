import { Meta, StoryObj } from "@storybook/react";
import { Box, Button, Card, FloatingUI, Popover } from "@frigade/react";

const meta: Meta<typeof Popover> = {
  title: "Design System/Popover",
  parameters: {
    layout: "centered",
  },
};
export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Box>
      <Popover.Root>
        <Popover.Trigger>
          <Button.Primary>Popover.Trigger</Button.Primary>
        </Popover.Trigger>
        <Popover.Content>
          <Card borderWidth="md">
            <Card.Title>Popover.Content</Card.Title>
          </Card>
        </Popover.Content>
      </Popover.Root>
    </Box>
  ),
};

export const Nested: Story = {
  render: () => (
    <FloatingUI.FloatingTree>
      <Box>
        <Popover.Root>
          <Popover.Trigger>
            <Button.Primary>Popover.Trigger</Button.Primary>
          </Popover.Trigger>
          <Popover.Content>
            <Card borderWidth="md">
              <Card.Title>Popover.Content</Card.Title>
              <Popover.Root>
                <Popover.Trigger>
                  <Button.Primary>Nested Popover.Trigger</Button.Primary>
                </Popover.Trigger>
                <Popover.Content>
                  <Card borderWidth="md">
                    <Card.Title>Nested Popover.Content</Card.Title>
                  </Card>
                </Popover.Content>
              </Popover.Root>
            </Card>
          </Popover.Content>
        </Popover.Root>
      </Box>
    </FloatingUI.FloatingTree>
  ),
};

export const AutoScroll: Story = {
  render: () => (
    <Box marginTop="200vh">
      <Popover.Root autoScroll open>
        <Popover.Trigger>
          <Button.Primary>Popover.Trigger</Button.Primary>
        </Popover.Trigger>
        <Popover.Content>
          <Card borderWidth="md">
            <Card.Title>Popover.Content</Card.Title>
          </Card>
        </Popover.Content>
      </Popover.Root>
    </Box>
  ),
};
