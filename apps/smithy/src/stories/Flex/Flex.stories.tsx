import { Flex, Text } from "@frigade/reactv2";

export default {
  title: "Components/Flex",
  component: Flex,
};

export const Default = {
  decorators: [
    () => {
      return (
        <Flex.Row
          color="blue500"
          alignItems="center"
          justifyContent="center"
          p="2 4 6 8"
        >
          <Text>Oh ok we're testing some Flex components then!</Text>
        </Flex.Row>
      );
    },
  ],
};
