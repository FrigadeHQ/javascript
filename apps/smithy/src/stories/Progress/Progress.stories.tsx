import { Flex, Progress, Text } from "@frigade/react";

export default {
  title: "Design System/Progress",
  component: Progress.Bar,
};

export const Default = {
  args: {
    current: 2,
    total: 6,
  },
  decorators: [
    (_, { args }) => (
      <Flex.Column gap={5}>
        <Flex.Column gap={1}>
          <Text.H3>Progress.Bar</Text.H3>
          <Progress.Bar maxWidth="200px" {...args} />
        </Flex.Column>
        <Flex.Column gap={1}>
          <Text.H3>Progress.Dots</Text.H3>
          <Progress.Dots {...args} />
        </Flex.Column>
        <Flex.Column gap={1}>
          <Text.H3>Progress.Segments</Text.H3>
          <Progress.Segments maxWidth="200px" {...args} />
        </Flex.Column>
        <Flex.Column gap={1}>
          <Text.H3>Progress.Ring</Text.H3>
          <Flex.Row gap="2">
            <Progress.Ring {...args} showLabel />
            <Progress.Ring
              {...args}
              height="24px"
              strokeWidth="4px"
              width="24px"
            />
          </Flex.Row>
        </Flex.Column>
      </Flex.Column>
    ),
  ],
};
