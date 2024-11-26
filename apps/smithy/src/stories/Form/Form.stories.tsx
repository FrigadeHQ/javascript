import {
  Announcement,
  Dialog,
  Form,
  type FormFieldProps,
  SelectField,
} from "@frigade/react";
import { useEffect, useState } from "react";

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
    // as: Dialog,
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
    onComplete: (e, properties) => console.log("Complete", e, properties),
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

export const VariablesInForms = {
  args: {
    dismissible: true,
    flowId: "flow_fpJlqkbl",
  },
  decorators: [
    (Story, { args }) => {
      const [testVar, setTestVar] = useState("test1");
      const [otherVar, setOtherVar] = useState("test2");

      useEffect(() => {
        // setTimeout to simulate async data fetching
        setTimeout(() => {
          setTestVar("updated var 1");
          setOtherVar("updated var 2");
        }, 1000);

        // update it again after 2000ms
        setTimeout(() => {
          setTestVar("updated var 1 again");
          setOtherVar("updated var 2 again");
        }, 2000);
      }, []);
      ``;

      return (
        <div>
          {/*<Story {...args} />*/}
          <Form
            flowId="flow_GSfKhVKmWXTw2wdt"
            variables={{
              testVar: testVar,
              otherVar: otherVar,
            }}
            onComplete={() => {
              console.log("form was completed");
            }}
          />
        </div>
      );
    },
  ],
};
