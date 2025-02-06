import { useState } from "react";
import { Box, Button, Flex, useAutoScroll } from "@frigade/react";

export default {
  title: "Hooks/useAutoScroll",
};

export const Default = {
  args: {
    scrollOptions: true,
  },

  decorators: [
    () => {
      const [scrollRef, setScrollRef] = useState<Element>();

      useAutoScroll(scrollRef);

      return (
        <Box backgroundColor="pink" marginTop="200vh" ref={setScrollRef}>
          Scroll to this element
        </Box>
      );
    },
  ],
};
