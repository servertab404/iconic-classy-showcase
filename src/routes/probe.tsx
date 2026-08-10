import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/probe")({
  component: Probe,
});

function Probe() {
  const [n, setN] = useState(0);
  useEffect(() => setN(1), []);
  return <div id="probe">hydrated:{n}</div>;
}
