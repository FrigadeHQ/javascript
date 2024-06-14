import { Announcement } from "@/index.ts";

export default {
  title: "collections/Two Announcements",
  component: Announcement,
};

const ANNOUNCEMENT_X = "flow_rGnGbp4D";
const ANNOUNCEMENT_Y = "flow_lxi6FPxr";

export const TwoAnnouncements = {
  args: {
    dismissible: true,
  },
  decorators: [
    () => {
      return (
        <>
          {/* Announcement X */}
          <Announcement flowId={ANNOUNCEMENT_X} />
          <Announcement flowId={ANNOUNCEMENT_Y} />
        </>
      );
    },
  ],
};
