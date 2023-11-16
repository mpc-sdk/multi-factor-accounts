import React, { createContext } from "react";
import { useDispatch } from 'react-redux';

import { invalidateAccounts } from "@/app/store/accounts";
const BroadcastContext = createContext(null);

const BroadcastProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const channel = new BroadcastChannel("accounts");

  channel.onmessage = async (event) => {
    const { data } = event;
    if (data === "invalidate") {
      await dispatch(invalidateAccounts());
    }
  }

  const invalidate = () => {
    channel.postMessage("invalidate");
  };

  return (
    <BroadcastContext.Provider value={invalidate}>
      {children}
    </BroadcastContext.Provider>
  );
};

export { BroadcastContext };
export default BroadcastProvider;
