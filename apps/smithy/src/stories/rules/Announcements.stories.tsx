import { Announcement } from "@frigade/react";
import { StoryContext, StoryFn } from "@storybook/react";

export default {
  title: "Rules/Two Announcements",
  component: Announcement,
};

export const TwoAnnouncements = {
  args: {
    dismissible: true,
  },
  decorators: [
    (_: StoryFn, options: StoryContext) => {
      return (
        <>
          <Announcement flowId="flow_rGnGbp4D" />
          <Announcement flowId="flow_lxi6FPxr" />
        </>
      );
    },
  ],
};
