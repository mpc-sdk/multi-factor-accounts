import { useEffect, useState, useContext } from "react";
import { MetaMaskContext } from "@/app/providers/metamask";
import defaultServerUrl from "@/lib/server-url";

// Get the balance of an address from MetaMask.
export function useBalance(address: string) {
  const [balance, setBalance] = useState(null);
  const [state] = useContext(MetaMaskContext);
  useEffect(() => {
    const loadBalance = async () => {
      const _balance = await state.provider.getBalance(address);
      setBalance(_balance);
    };
    loadBalance();
  }, []);
  return balance;
}

// Get the current server URL.
export function useServerUrl(): [string, (url: string) => void] {
  const [serverUrl, setServerUrl] = useState(
    localStorage.getItem("serverUrl") as string,
  );

  const updateServerUrl = (url: string) => {
    localStorage.setItem("serverUrl", url);
    setServerUrl(url);
  };

  return [serverUrl || defaultServerUrl, updateServerUrl];
}
