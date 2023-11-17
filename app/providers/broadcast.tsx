import React, { createContext, useState } from "react";
const BroadcastContext = createContext(null);

const channel = new BroadcastChannel("accounts");

const BroadcastProvider = ({ children }: { children: React.ReactNode }) => {
  const [changed, setChanged] = useState(0);

  channel.onmessage = async (event) => {
    const { data } = event;
    if (data === "invalidate") {
      setChanged(changed + 1);
    }
  };

  const invalidate = async () => {
    channel.postMessage("invalidate");
    setChanged(changed + 1);
  };

  return (
    <BroadcastContext.Provider value={{ invalidate }}>
      <div key={changed}>{children}</div>
    </BroadcastContext.Provider>
  );
};

export { BroadcastContext };
export default BroadcastProvider;
