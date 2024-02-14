import { useGroup } from "@frigade/reactv2";
import { useEffect } from "react";

export default {
  title: "Hooks/useGroup",
};

export function Default() {
  const { setProperties, isLoading } = useGroup();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    async function setProps() {
      await setProperties({
        orgPicture: "https://placekitten.com/24/24",
      });
    }

    setProps();
  }, [isLoading]);

  return (
    <div>
      <div id="">isLoading: {isLoading ? "true" : "false"}</div>
    </div>
  );
}
