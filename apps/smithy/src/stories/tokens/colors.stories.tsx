import { Flex, Text, tokens } from "@frigade/react";

export default {
  title: "Design System/Tokens/Colors",
};

export const Palette = {
  decorators: [
    () => {
      const baseColors = {
        blue: tokens.colors.blue,
        gray: tokens.colors.gray,
        green: tokens.colors.green,
        red: tokens.colors.red,
        yellow: tokens.colors.yellow,
      };

      console.log(baseColors);

      return Object.entries(baseColors).map(([name, scale]) => (
        <>
          <Flex.Row alignItems="center" gap={2} key={name} marginBottom="2">
            <Text.H2 flexBasis="10%" flexShrink="0">
              {name.replace(/^(\w)/, (_, $1) => $1.toUpperCase())}
            </Text.H2>
            {Object.entries(scale).map(([degree, hsl]) => (
              <Flex.Column
                alignItems="center"
                backgroundColor={hsl}
                borderRadius="md"
                justifyContent="center"
                key={`${name}-${degree}`}
                width="220px"
                height="120px"
              >
                <Text.H4
                  color={
                    Number(degree) < 500
                      ? `${name}.700`
                      : degree === "500"
                      ? `${name}.900`
                      : `${name}.300)`
                  }
                >
                  {degree}
                </Text.H4>
              </Flex.Column>
            ))}
          </Flex.Row>
        </>
      ));
    },
  ],
};
