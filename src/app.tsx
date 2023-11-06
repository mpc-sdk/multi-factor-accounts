import React, { useEffect, useState, useMemo } from "react";
//import init from "@mpc-sdk/mpc-bindings";

import { Routes, Route } from "react-router-dom";
import detectEthereumProvider from "@metamask/detect-provider";

import WorkerProvider, { webWorker } from "./worker";

type WorkerMessage = {
  data: { ready: boolean };
};

/*
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
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

      // Setup the wasm helpers that run on the main UI thread
      //await init();

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
        Failed to detect an ethereum provider, please install{" "}
        <a href="https://metamask.io/flask/">MetaMask Flask</a>
      </p>
    );
  }

  if (provider !== window.ethereum) {
    return (
      <p>
        The wallet provider is not correct, do you have multiple wallets
        installed?
      </p>
    );
  }

  /*
    <ThemeProvider theme={theme}>
      <>
        <CssBaseline />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <WebSocketProvider>
            <WorkerProvider>
              <ChainProvider>
                <MainAppBar />
                <Content />
                <Dialogs />
                <Snackbars />
              </ChainProvider>
            </WorkerProvider>
          </WebSocketProvider>
        </div>
      </>
    </ThemeProvider>
  */

  return (<p>Rendering</p>);
}
