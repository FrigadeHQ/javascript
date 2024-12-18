import * as React from "react";
import { FrigadeJS, Provider, useFlow } from "@frigade/react";

import "./global.css";

// LOCAL DEV
// export const FRIGADE_API_KEY =
//   "api_public_0FaxqVs527bAVQsFK4RcuJYjVqHeC5U7CGJLfsVXRE36eAKiLjwAEugZYeFijCI2";
// export const FRIGADE_API_URL = "https://localhost:3443/v1/public";

// FRIGADE DEV
export const FRIGADE_API_KEY =
  "api_public_GY6O5JS99XTL2HAXU0D6OQHYQ7I706P5I9C9I7CEZFNFUFRARD2DVDSMFW3YT3SV";
export const FRIGADE_API_URL = "https://api.frigade.com";

// const userId = `jonathan_livingston_smeagol`;
export const FRIGADE_USER_ID = `jonathan_livingston_smeagol_${Math.random()
  .toString(36)
  .substring(2, 9)}`;

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Provider
          apiKey={FRIGADE_API_KEY}
          apiUrl={FRIGADE_API_URL}
          defaultCollection={true}
          // generateGuestId={true}
          userId={FRIGADE_USER_ID}
          // syncOnWindowUpdates={false}

          // theme={{
          //   colors: {
          //     primary: {
          //       surface: "pink",
          //       active: {
          //         surface: "teal",
          //       },
          //       hover: {
          //         surface: "orange",
          //       },
          //     },
          //   },
          // }}
          userProperties={{
            firstName: "Jonathan",
            lastName: "Livingston",
            name: "Jonathan Livingston",
            email: "jonathan.livingston@frigade.com",
            image:
              "https://cdn.frigade.com/6a05066d-6781-46f9-8476-bbbde3c39960.jpeg",
          }}
          variables={{
            globalFullName: "Balrog Hansen",
          }}
          // __readOnly={true}
          // __flowStateOverrides={{
          //   flow_ZacoWhZhzqbdHQ8k: {
          //     flowSlug: "some-flow",
          //     flowName: "Some flow",
          //     flowType: FrigadeJS.FlowType.BANNER,
          //     data: {
          //       steps: [
          //         {
          //           id: "step-one",
          //           title: "Banner title",
          //           subtitle: "Banner subtitle",
          //           primaryButton: { title: "Primary CTA" },
          //           secondaryButton: { title: "Secondary CTA" },
          //           imageUri: "https://placehold.co/40x40",
          //           $state: {
          //             completed: false,
          //             started: false,
          //             visible: true,
          //             blocked: false,
          //             skipped: false,
          //           },
          //         },
          //       ],
          //     },
          //     $state: {
          //       currentStepId: "step-one",
          //       visible: true,
          //       started: false,
          //       completed: false,
          //       skipped: false,
          //       currentStepIndex: -1,
          //     },
          //   },
          // }}
        >
          <Story />
        </Provider>
      );
    },
  ],
};

export default preview;
