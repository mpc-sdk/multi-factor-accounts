import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import detectEthereumProvider from "@metamask/detect-provider";

import Layout from "@/pages/Layout";
import NotFound from "@/pages/NotFound";
import About from "@/pages/About";
import Home from "@/pages/Home";
import Accounts from "@/pages/Accounts";
import Account from "@/pages/Account";
import CreateKey from "@/pages/CreateKey";
import JoinKey from "@/pages/JoinKey";

import WorkerProvider, { webWorker } from "./providers/worker";
import ChainProvider from "./providers/chain";
import KeypairProvider from "./providers/keypair";

type WorkerMessage = {
  data: { ready: boolean };
};

/*
  <Route path="/keys/create" element={<Create />} />
  <Route path="/keys/import" element={<Import />} />
  <Route path="/keys/join/:groupId/:sessionId" element={<Join />} />
  <Route path="/keys/:address" element={<ShowKey />} />
  <Route path="/keys" element={<Keys />} />
  <Route path="/keys/:address/sign/message" element={<Message />} />
  <Route
    path="/keys/:address/sign/join/:signingType/:groupId/:sessionId"
    element={<JoinSignSession />}
  />
  <Route
    path="/keys/:address/sign/transaction"
    element={<Transaction />}
  />
  <Route path="*" element={<NotFound />} />
*/

function Content() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/keys/create" element={<CreateKey />} />
      <Route path="/keys/join/:meetingId/:userId" element={<JoinKey />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/accounts/:address" element={<Account />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      const provider = await detectEthereumProvider();
      setProvider(provider);

      // Now we are ready to render
      setReady(true);
    };

    // Wait for the worker webassembly to be ready
    const onWorkerReady = (msg: WorkerMessage) => {
      if (msg.data.ready) {
        webWorker.removeEventListener("message", onWorkerReady);
        initialize();
      }
    };

    webWorker.addEventListener("message", onWorkerReady);
  }, []);

  if (ready === false) {
    return null;
  }

  if (!provider) {
    return (
      <p>
        Failed to detect an ethereum provider, please install&nbsp;
        <a href="https://metamask.io/flask/">MetaMask Flask</a>
      </p>
    );
  }

  if (provider !== ethereum) {
    return (
      <p>
        The wallet provider is not correct, do you have multiple wallets
        installed?
      </p>
    );
  }

  return (
    <WorkerProvider>
      <KeypairProvider>
        <ChainProvider>
          <Layout>
            <Content />
          </Layout>
        </ChainProvider>
      </KeypairProvider>
    </WorkerProvider>
  );
}
