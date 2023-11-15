import React, { useEffect, useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "@/pages/Layout";
import NotFound from "@/pages/NotFound";
import About from "@/pages/About";
import Accounts from "@/pages/Accounts";
import Account from "@/pages/Account";
import CreateKey from "@/pages/CreateKey";
import JoinKey from "@/pages/JoinKey";
import NoMetaMask from "@/pages/NoMetaMask";
import InstallSnap from "@/pages/InstallSnap";

import MetaMaskProvider, {
  MetaMaskContext,
  MetaMaskActions,
} from "@/app/providers/metamask";
import WorkerProvider, { webWorker } from "@/app/providers/worker";
import ChainProvider from "@/app/providers/chain";
import KeypairProvider from "@/app/providers/keypair";
import { getSnap } from "@/lib/snap";

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
      <Route path="/about" element={<About />} />
      <Route path="/keys/create" element={<CreateKey />} />
      <Route path="/keys/join/:meetingId/:userId" element={<JoinKey />} />
      <Route path="/" element={<Accounts />} />
      <Route path="/accounts/:address" element={<Account />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function GuardMetaMask({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useContext(MetaMaskContext);

  const onConnect = async () => {
    const installedSnap = await getSnap();
    dispatch({
      type: MetaMaskActions.SetInstalled,
      payload: installedSnap,
    });
  };

  if (!state.hasMetaMask) {
    return <NoMetaMask />;
  }

  if (state.hasMetaMask && !state.installedSnap) {
    return <InstallSnap onConnect={onConnect} />;
  }

  return children;
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait for the worker webassembly to be ready
    const onWorkerReady = (msg: WorkerMessage) => {
      if (msg.data.ready) {
        webWorker.removeEventListener("message", onWorkerReady);
        setReady(true);
      }
    };
    webWorker.addEventListener("message", onWorkerReady);
  }, []);

  if (ready === false) {
    return null;
  }

  return (
    <MetaMaskProvider>
      <WorkerProvider>
        <KeypairProvider>
          <Layout>
            <GuardMetaMask>
              <ChainProvider>
                <Content />
              </ChainProvider>
            </GuardMetaMask>
          </Layout>
        </KeypairProvider>
      </WorkerProvider>
    </MetaMaskProvider>
  );
}
