import "./global.css";

import * as React from "react";
import { Provider } from "@frigade/reactv2";

// LOCAL DEV
// const FRIGADE_API_KEY =
//   "api_public_0FaxqVs527bAVQsFK4RcuJYjVqHeC5U7CGJLfsVXRE36eAKiLjwAEugZYeFijCI2";
// const API_URL = "https://localhost:3443/v1/public";

// FRIGADE DEV
const FRIGADE_API_KEY =
  "api_public_GY6O5JS99XTL2HAXU0D6OQHYQ7I706P5I9C9I7CEZFNFUFRARD2DVDSMFW3YT3SV";
const API_URL = "https://api.frigade.com/v1/public";

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
          apiUrl={API_URL}
          userId="jonathan_livingston_smeagol"
        >
          <Story />
        </Provider>
      );
    },
  ],
};

export default preview;
