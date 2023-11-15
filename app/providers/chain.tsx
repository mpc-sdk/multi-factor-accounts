import React, { createContext, useState, useEffect, useContext } from "react";
import { MetaMaskContext } from "@/app/providers/metamask";

const ChainContext = createContext(null);

const ChainProvider = ({ children }: { children: React.ReactNode }) => {
  const [state] = useContext(MetaMaskContext);
  const [chain, setChain] = useState<string>(null);

  useEffect(() => {
    if (state.hasMetaMask) {
      ethereum.on("chainChanged", handleChainChanged);

      const loadChainInfo = async () => {
        const chainId = await ethereum.request({ method: "eth_chainId" });
        setChain(chainId as string);
      };

      loadChainInfo();
    }
  }, []);

  function handleChainChanged(chainId: string) {
    setChain(chainId);
  }

  return (
    <ChainContext.Provider value={chain}>{children}</ChainContext.Provider>
  );
};

export { ChainContext };
export default ChainProvider;
