import { Form } from "@frigade/react";

export default {
  title: "Components/Form",
  component: Form,
  argTypes: {
    container: {
      type: "select",
      options: ["none", "dialog"],
    },
  },
};

export const Default = {
  args: {
    container: "none",
    dismissible: true,
    flowId: "flow_GSfKhVKmWXTw2wdt",
    width: "400px",
  },
};
