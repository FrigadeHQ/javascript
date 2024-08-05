import { useFlow } from "@frigade/react";

export default {
  title: "Hooks/useFlow",
};

export function Default() {
  const { flow } = useFlow("flow_U63A5pndRrvCwxNs", {
    variables: {
      firstName: "Jonathan",
    },
  });

  function clickyClicky() {
    flow.getCurrentStep()?.complete();
  }

  return (
    <div>
      <button onClick={clickyClicky}>Complete current step</button>
      <pre>{JSON.stringify(flow, null, 2)}</pre>
    </div>
  );
}
