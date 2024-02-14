import { useUser } from "@frigade/reactv2";
import { useEffect, useState } from "react";

export default {
  title: "Hooks/useUser",
};

export function Default() {
  const { setProperties } = useUser();

  const [hasSetProps, setHasSetProps] = useState(false);
  useEffect(() => {
    async function setProps() {
      await setProperties({
        email: "smeagol@aragon.com",
      });
      setHasSetProps(true);
    }

    setProps();
  }, []);

  return (
    <div>
      <div id="">
        hasSuccessFullySentPropsToFrigadeAPI: {hasSetProps ? "true" : "false"}
      </div>
    </div>
  );
}
