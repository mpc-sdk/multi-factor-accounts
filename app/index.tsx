import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SnapsEthereumProvider } from '@metamask/snaps-sdk';

import App from "./app";

declare global {
  interface Window {
    ethereum: SnapsEthereumProvider;
  }
}

const root = ReactDOMClient.createRoot(document.querySelector("main"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
