import React from "react";

import Loader from "@/components/Loader";

// View shown whilst a session is executing.
export default function SessionRunner({
  loaderText,
  executor,
  message,
}: {
  loaderText: string,
  executor: () => Promise<void>,
  message: React.ReactNode,
}) {
  return <div className="flex flex-col space-y-6 mt-12">
    {message}
    <Loader text={loaderText} />
  </div>;
}
