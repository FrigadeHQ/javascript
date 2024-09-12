import { useFlow } from "@frigade/react";

export default {
  title: "Hooks/useFlow",
};

export function Default() {
  const { flow, isLoading } = useFlow("flow_U63A5pndRrvCwxNs", {
    variables: {
      firstName: "Jonathan",
    },
  });

  function clickyClicky() {
    flow.getCurrentStep()?.complete();
  }

  console.log("isLoading:", isLoading);
  flow.rawData.flowType;

  return (
    <div>
      <button onClick={clickyClicky}>Complete current step</button>
      <pre>{JSON.stringify(flow, null, 2)}</pre>
    </div>
  );
}
