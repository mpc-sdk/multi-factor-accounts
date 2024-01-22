import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./app";

const root = ReactDOMClient.createRoot(document.querySelector("main"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
