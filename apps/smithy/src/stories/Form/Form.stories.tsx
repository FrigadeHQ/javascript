import { Form, type FormFieldProps } from "@frigade/react";

export default {
  title: "Components/Form",
  component: Form,
};

function CustomStep({ formContext }: FormFieldProps) {
  const values = formContext.getValues();
  console.log("custom render", values);
  return null;
}

export const Default = {
  args: {
    dismissible: false,
    flowId: "flow_GSfKhVKmWXTw2wdt",
    width: "400px",
    onPrimary: () => console.log("Primary"),
    onSecondary: () => {
      console.log("Secondary");
      return true;
    },
    fieldTypes: {
      customTest: CustomStep,
    },
  },
};

export const FormBranching = {
  args: {
    dismissible: false,
    flowId: "flow_fpJlqkbl",
    width: "400px",
    onPrimary: (step, e, properties) =>
      console.log("Primary", step, e, properties),
    onSecondary: () => {
      console.log("Secondary");
      return true;
    },
  },
};
