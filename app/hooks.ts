import { useEffect, useState, useContext } from "react";
import {MetaMaskContext} from "@/app/providers/metamask";

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
  }, [])
  return balance;
}
