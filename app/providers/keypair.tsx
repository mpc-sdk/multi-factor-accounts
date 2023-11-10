import React, { createContext, useState, useEffect, useContext } from "react";

import { Keypair } from "@/app/model";
import { WorkerContext } from "@/app/providers/worker";
import { generateKeypair } from "@/lib/client";

const KeypairContext = createContext(null);

const KeypairProvider = ({ children }: { children: React.ReactNode }) => {
  const worker = useContext(WorkerContext);
  const [keypair, setKeypair] = useState<Keypair>(null);

  useEffect(() => {
    const initializeKeypair = async () => {
      const keypair = await generateKeypair(worker);
      setKeypair(keypair);
    };
    initializeKeypair();
  }, []);

  return (
    <KeypairContext.Provider value={keypair}>
      {children}
    </KeypairContext.Provider>
  );
};

export { KeypairContext };
export default KeypairProvider;
