import { Flex, Progress } from "@frigade/react";

export default {
  title: "Components/Progress",
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
        <Progress.Bar {...args} />
        <Progress.Dots {...args} />
        <Progress.Segments {...args} />
      </Flex.Column>
    ),
  ],
};
