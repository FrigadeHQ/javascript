import { useUser } from "@frigade/react";
import { useEffect, useState } from "react";

export default {
  title: "Hooks/useUser",
};

export function Default() {
  const { addProperties, track } = useUser();

  const [hasSetProps, setHasSetProps] = useState(false);
  useEffect(() => {
    async function setProps() {
      await addProperties({
        email: "smeagol@aragon.com",
      });
      await track("User Properties Set", {
        sword: "sting",
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
