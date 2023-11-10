import React, {
  createContext,
  useState,
  useEffect,
} from "react";

const ChainContext = createContext(null);

const ChainProvider = ({children}: {children: React.ReactNode}) => {
  const [chain, setChain] = useState<string>(null);

  useEffect(() => {
    ethereum.on("chainChanged", handleChainChanged);

    const loadChainInfo = async () => {
      const chainId = await ethereum.request({ method: "eth_chainId" });
      setChain(chainId as string);
    };

    loadChainInfo();
  }, []);

  function handleChainChanged(chainId: string) {
    setChain(chainId);
  }

  return (
    <ChainContext.Provider value={chain}>
      {children}
    </ChainContext.Provider>
  );
};

export { ChainContext };
export default ChainProvider;
