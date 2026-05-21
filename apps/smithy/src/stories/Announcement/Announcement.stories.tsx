import {
  Announcement,
  FrigadeJS,
  Provider,
  Tour,
  useFlow,
  useFrigade,
} from "@frigade/react";
import { useEffect } from "react";

export default {
  title: "Components/Announcement",
  component: Announcement,
};

export const Default = {
  args: {
    dismissible: true,
    flowId: "flow_vLivpwoH",
    modal: true,
    onDismiss: () => console.log("Dismissed"),
  },
};

// TEMP verification harness for the mobile popup-blocker fix. Uses __readOnly
// + __flowStateOverrides to mock an Announcement whose primary CTA opens a
// URL in a new tab. With the fix in place, the primary button renders as
// `<a href target="_blank" rel="noopener noreferrer">` so mobile browsers
// don't block the popup.
const MOCK_FLOW_ID = "flow_mock_link_button";
const linkButtonFlowOverride = {
  [MOCK_FLOW_ID]: {
    flowSlug: MOCK_FLOW_ID,
    flowName: "Link Button Repro",
    flowType: FrigadeJS.FlowType.ANNOUNCEMENT,
    data: {
      steps: [
        {
          id: "step-one",
          title: "Payment links are here",
          subtitle: "Now you can create an order and send your customers a link to pay through multiplate.",
          primaryButton: {
            title: "Learn more",
            uri: "https://example.com/learn-more",
            target: "_blank",
          },
          secondaryButton: { title: "Dismiss" },
          $state: {
            completed: false,
            started: false,
            visible: true,
            blocked: false,
            skipped: false,
          },
        },
      ],
    },
    $state: {
      currentStepId: "step-one",
      visible: true,
      started: false,
      completed: false,
      skipped: false,
      currentStepIndex: 0,
    },
  },
};

export const PrimaryButtonAsLink = {
  args: { flowId: MOCK_FLOW_ID, modal: true, dismissible: true },
  decorators: [
    (Story, { args }) => (
      <Provider
        apiKey="api_storybook_mock_link_button"
        userId="storybook_mock_user"
        __readOnly={true}
        __flowStateOverrides={linkButtonFlowOverride}
      >
        <Story {...args} />
      </Provider>
    ),
  ],
};

// Same mock flow, but with a custom navigate handler — should fall back to
// rendering as <button> so the consumer's navigate gets called as before.
export const PrimaryButtonLinkWithCustomNavigate = {
  args: { flowId: MOCK_FLOW_ID, modal: true, dismissible: true },
  decorators: [
    (Story, { args }) => (
      <Provider
        apiKey="api_storybook_mock_link_button_custom_nav"
        userId="storybook_mock_user_2"
        __readOnly={true}
        __flowStateOverrides={linkButtonFlowOverride}
        navigate={(url, target) => {
          console.log("custom navigate:", url, target);
          window.open(url, target);
        }}
      >
        <Story {...args} />
      </Provider>
    ),
  ],
};

export const TestReset = {
  args: {
    dismissible: true,
    flowId: "flow_8Ybz7lMK",
  },
  decorators: [
    (Story, { args }) => {
      const { frigade } = useFrigade();
      const { flow } = useFlow(args.flowId);

      useEffect(() => {
        frigade.on("step.start", (event, flow, previousFlow, step) => {
          console.log("step.start", event, flow.id, step?.id);
        });
        frigade.on("step.complete", (event, flow, previousFlow, step) => {
          console.log("step.complete", event, flow.id, step?.id);
        });

        frigade.on("flow.start", (event, flow) => {
          console.log("flow.start", event, flow.id);
        });
        frigade.on("flow.complete", (event, flow) => {
          console.log("flow.complete", event, flow.id);
        });
        frigade.on("flow.skip", (event, flow) => {
          console.log("flow.skip", event, flow.id);
        });
      }, []);

      return (
        <div>
          <Story {...args} />
          <button
            onClick={async () => {
              // const flow = await frigade.getFlow(args.flowId);
              await flow.restart();
              await flow.reload();
              console.log("FLOW IN STORY: ", flow);
            }}
          >
            Reset flow
          </button>
        </div>
      );
    },
  ],
};

export const ModalCollisions = {
  decorators: [
    (Story, { args }) => {
      // const { frigade } = useFrigade();
      const { flow: flowA } = useFlow("flow_gT6bpnCn");
      const { flow: flowB } = useFlow("flow_FMjrv1vC");

      return (
        <div>
          <Tour flowId="flow_U63A5pndRrvCwxNs" />
          <Announcement flowId="flow_FMjrv1vC" />
          <Announcement flowId="flow_gT6bpnCn" />

          <button
            onClick={async () => {
              // const flow = await frigade.getFlow(args.flowId);
              await flowA.restart();
            }}
          >
            Reset flow A
          </button>
          <button
            onClick={async () => {
              // const flow = await frigade.getFlow(args.flowId);
              await flowB.restart();
            }}
          >
            Reset flow B
          </button>

          <div id="tooltip-storybook-0">Tour anchor</div>
        </div>
      );
    },
  ],
};
