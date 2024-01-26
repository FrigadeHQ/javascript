import { Form } from "@frigade/reactv2";

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
    flowId: "flow_GSfKhVKmWXTw2wdt",
    width: "400px",
  },
};
