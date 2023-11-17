import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from "./app";

const root = ReactDOMClient.createRoot(document.querySelector("main"));
root.render(
  <HashRouter>
    <App />
  </HashRouter>,
);
