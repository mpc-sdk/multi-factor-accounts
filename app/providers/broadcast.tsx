import React, { createContext, useState } from "react";
const BroadcastContext = createContext(null);

const BroadcastProvider = ({ children }: { children: React.ReactNode }) => {
  const [changed, setChanged] = useState(0);
  const channel = new BroadcastChannel("accounts");

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
      {children}
    </BroadcastContext.Provider>
  );
};

export { BroadcastContext };
export default BroadcastProvider;
