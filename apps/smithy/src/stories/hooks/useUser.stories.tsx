import { useUser } from "@frigade/reactv2";
import { useEffect } from "react";

export default {
  title: "Hooks/useUser",
};

export function Default() {
  const { setProperties, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    async function setProps() {
      await setProperties({
        email: "smeagol@aragon.com",
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
