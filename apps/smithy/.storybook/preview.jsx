import "./global.css";

import * as React from "react";
import { useEffect } from "react";
import { Provider } from "@frigade/react";

// LOCAL DEV
// const FRIGADE_API_KEY =
//   "api_public_0FaxqVs527bAVQsFK4RcuJYjVqHeC5U7CGJLfsVXRE36eAKiLjwAEugZYeFijCI2";
// const API_URL = "https://localhost:3443/v1/public";

// FRIGADE DEV
const FRIGADE_API_KEY =
  "api_public_GY6O5JS99XTL2HAXU0D6OQHYQ7I706P5I9C9I7CEZFNFUFRARD2DVDSMFW3YT3SV";
const API_URL = "https://api.frigade.com";

// const userId = `jonathan_livingston_smeagol`;
const userId = `jonathan_livingston_smeagol_${Math.random()
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
      const [delayedUserId, setDelayedUserId] = React.useState(undefined);

      useEffect(() => {
        setTimeout(() => {
          setDelayedUserId(userId);
        }, 1000);
      }, []);

      return (
        <Provider
          apiKey={FRIGADE_API_KEY}
          apiUrl={API_URL}
          defaultCollection={false}
          // generateGuestId={false}
          // userId={delayedUserId}
          userId="jonathan_livingston_smeagol_jun19"
          // syncOnWindowUpdates={false}
          userProperties={{
            firstName: "Jonathan",
            lastName: "Livingston",
            name: "Jonathan Livingston",
            email: "jonathan.livingston@frigade.com",
            image:
              "https://cdn.frigade.com/6a05066d-6781-46f9-8476-bbbde3c39960.jpeg",
          }}
          // __readOnly={true}
          // __flowConfigOverrides={{
          //   flow_cvWFczn1RMHp9ZcK: JSON.stringify({
          //     steps: [
          //       {
          //         id: "test",
          //         title: "Title 1",
          //         subtitle: "Subtitle 1",
          //         primaryButtonTitle: "Next",
          //       },
          //       {
          //         id: "test2",
          //         title: "Title 2",
          //         subtitle: "Subtitle 2",
          //         primaryButtonTitle: "Done",
          //       },
          //     ],
          //   }),
          // }}
        >
          <Story />
        </Provider>
      );
    },
  ],
};

export default preview;
