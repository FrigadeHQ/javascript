import { Announcement, useGroup } from "@frigade/react";
import { useEffect } from "react";

export default {
  title: "Hooks/useGroup",
};

export function Default() {
  const { addProperties, setGroupId } = useGroup();
  useEffect(() => {
    async function setProps() {
      await setGroupId("my-group-id");
      // Doesn't fire?
      await addProperties({
        isSuperAdmin: false,
      });
    }
    setTimeout(() => {
      setProps();
    }, 3000);
  }, []);

  return (
    <div>
      <Announcement flowId="flow_cvWFczn1RMHp9ZcK" />
    </div>
  );
}
