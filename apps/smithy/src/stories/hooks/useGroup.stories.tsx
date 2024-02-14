import { useGroup } from "@frigade/reactv2";
import { useEffect, useState } from "react";

export default {
  title: "Hooks/useGroup",
};

export function Default() {
  const { setProperties } = useGroup();
  const [hasSetProps, setHasSetProps] = useState(false);
  useEffect(() => {
    async function setProps() {
      await setProperties({
        orgPicture: "https://placekitten.com/24/24",
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
