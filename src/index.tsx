import React from "react";
import * as ReactDOMClient from "react-dom/client";
//import { Provider } from "react-redux";
//import { HashRouter } from "react-router-dom";

//import store from "./store";
//import App from "./app";

type RpcRequest = {
  method: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  params?: any;
};

type SnapEthereum = {
  request: (req: RpcRequest) => Promise<unknown>;
  on: (event: string, listener: (arg: any) => void) => void;
};

declare global {
  const ethereum: SnapEthereum;
  interface Window {
    ethereum: SnapEthereum;
  }
}

/*
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
*/

const root = ReactDOMClient.createRoot(document.querySelector("main"));
root.render(<p>Rendering</p>);
