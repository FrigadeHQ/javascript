import { Flex, Text } from "@frigade/reactv2";

export default {
  title: "Components/Flex",
  component: Flex,
};

export const Default = {
  decorators: [
    () => {
      return (
        <Flex
          color="blue500"
          alignItems="center"
          justifyContent="center"
          py={5}
        >
          <Text>Oh ok we're testing some Flex components then!</Text>
        </Flex>
      );
    },
  ],
};
