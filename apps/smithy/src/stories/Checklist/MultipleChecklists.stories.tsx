import { Checklist, Tour, useUser } from "@frigade/react";
import { StoryContext, StoryFn } from "@storybook/react";

export default {
  title: "Components/Checklist/MutlipleChecklists",
  component: Tour,
};

export const Default = {
  args: {
    dismissible: true,
  },
  decorators: [
    (_: StoryFn, options: StoryContext) => {
      const { addProperties } = useUser();

      return (
        <>
          <Checklist.Collapsible
            flowId="flow_K2dmIlteW8eGbGoo"
            onComplete={(flow, prevFlow) =>
              console.log("COMPLETE", flow, prevFlow)
            }
            variables={{
              firstName: "Smeagol",
            }}
            {...options.args}
          />
          <Checklist.Collapsible
            flowId="flow_U63A5pndRrvCwxNs"
            onComplete={(flow, prevFlow) =>
              console.log("COMPLETE", flow, prevFlow)
            }
            variables={{
              firstName: "Smeagol",
            }}
            {...options.args}
          />
        </>
      );
    },
  ],
};
