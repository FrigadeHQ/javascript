import type { TestRunnerConfig } from "@storybook/test-runner";

const config: TestRunnerConfig = {
  tags: {
    // Stories tagged "skip-test" are indexed and rendered in Storybook but
    // their play functions are skipped by the test runner.
    skip: ["skip-test"],
  },
};

export default config;
