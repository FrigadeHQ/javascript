import { Announcement, useFrigade } from "@frigade/reactv2";
import { useEffect, useState } from "react";

export default {
  title: "Hooks/useFrigade",
};

export function Default() {
  const { frigade, isLoading } = useFrigade();
  const [flowIds, setFlowIds] = useState<string[]>([]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    async function getFlows() {
      const flows = await frigade.getFlows();
      console.log(flows);
      setFlowIds(flows.map((flow) => flow.id));
    }

    getFlows();
  }, []);

  return (
    <div>
      <div>isLoading: {isLoading ? "true" : "false"}</div>
      <div>API Key: {frigade.config.apiKey}</div>
      <div>Flows: {flowIds.join(",")}</div>
      <Announcement flowId="flow_cvWFczn1RMHp9ZcK" />
    </div>
  );
}
