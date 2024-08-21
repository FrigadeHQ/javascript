import {
  Announcement,
  Dialog,
  Form,
  type FormFieldProps,
  SelectField,
} from "@frigade/react";

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
    onPrimary: (step, e, properties) =>
      console.log("Primary", step, e, properties),
    onSecondary: () => {
      console.log("Secondary");
      return true;
    },
    fieldTypes: {
      customTest: CustomStep,
    },
    as: Dialog,
    variables: {
      testVar: "hello world",
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

export const CustomForm = {
  args: {
    dismissible: false,
    flowId: "flow_DNfUtMXH",
    width: "400px",
    fieldTypes: {
      DynamicFollowUpBasedOnCategory: (props: FormFieldProps) => {
        const categoryValue = props.formContext.watch("category");
        const field = props.fieldData.props.mappings[categoryValue];

        if (!field) {
          return null;
        }

        return (
          <SelectField
            {...props}
            fieldData={{
              ...props.fieldData,
              ...field,
            }}
          />
        );
      },
    },
    onPrimary: (step, e, properties) =>
      console.log("Primary", step, e, properties),
    onSecondary: () => {
      console.log("Secondary");
      return true;
    },
  },
};

export const ChainingOfFlows = {
  args: {
    dismissible: true,
    flowId: "flow_fpJlqkbl",
  },
  decorators: [
    (Story, { args }) => {
      return (
        <div>
          <Story {...args} />
          <Announcement flowId="flow_LUjHxjFO" />
        </div>
      );
    },
  ],
};
