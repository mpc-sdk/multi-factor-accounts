import React, { useEffect, useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "@/pages/Layout";
import NotFound from "@/pages/NotFound";
import About from "@/pages/About";
import Accounts from "@/pages/Accounts";
import Account from "@/pages/Account";
import CreateKey from "@/pages/CreateKey";
import JoinKey from "@/pages/JoinKey";
import ApproveRequest from "@/pages/ApproveRequest";
import SignRequest from "@/pages/SignRequest";
import CreateSign from "@/pages/CreateSign";
import JoinSign from "@/pages/JoinSign";
import NoMetaMask from "@/pages/NoMetaMask";
import InstallSnap from "@/pages/InstallSnap";

import MetaMaskProvider, {
  MetaMaskContext,
  MetaMaskActions,
} from "@/app/providers/metamask";
import WorkerProvider, { webWorker } from "@/app/providers/worker";
import ChainProvider from "@/app/providers/chain";
import BroadcastProvider from "@/app/providers/broadcast";
import KeypairProvider from "@/app/providers/keypair";
import { getSnap } from "@/lib/snap";

type WorkerMessage = {
  data: { ready: boolean };
};

function Content() {
  return (
    <Routes>
      <Route path="/about" element={<About />} />
      <Route path="/keys/create" element={
        <BroadcastProvider>
          <CreateKey />
        </BroadcastProvider>
      } />
      <Route path="/keys/join/:meetingId/:userId" element={
        <BroadcastProvider>
          <JoinKey />
        </BroadcastProvider>
      } />
      <Route
        path="/"
        element={
          <BroadcastProvider>
            <Accounts />
          </BroadcastProvider>
        }
      />
      <Route
        path="/accounts/:address"
        element={
          <BroadcastProvider>
            <Account />
          </BroadcastProvider>
        }
      />
      <Route path="/approve/:requestId" element={
        <BroadcastProvider>
          <ApproveRequest />
        </BroadcastProvider>
      } />
      <Route path="/sign/:requestId" element={
        <BroadcastProvider>
          <SignRequest />
        </BroadcastProvider>
      } />
      <Route path="/sign/create/:requestId/:shareId" element={
        <BroadcastProvider>
          <CreateSign />
        </BroadcastProvider>
      } />
      <Route path="/sign/join/:meetingId/:userId" element={
        <BroadcastProvider>
          <JoinSign />
        </BroadcastProvider>
      } />
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
