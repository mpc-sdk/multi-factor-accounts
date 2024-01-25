import React, { useContext, useEffect } from "react";

import Loader from "@/components/Loader";
import { WorkerContext } from "@/app/providers/worker";
import { WebassemblyWorker } from "@/lib/client";
import { useServerUrl } from "@/app/hooks";

// View shown whilst a session is executing.
export default function SessionRunner({
  loaderText,
  executor,
  message,
}: {
  loaderText: string;
  executor: (worker: WebassemblyWorker, serverUrl: string) => Promise<void>;
  message: React.ReactNode;
}) {
  const [serverUrl] = useServerUrl();
  const worker = useContext(WorkerContext);

  // Call the session executor with our worker reference
  useEffect(() => {
    executor(worker, serverUrl);
  }, []);

  return (
    <div className="flex flex-col space-y-6 mt-12">
      {message}
      <Loader text={loaderText} />
    </div>
  );
}
