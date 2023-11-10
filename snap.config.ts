import type { SnapConfig } from "@metamask/snaps-cli";

const config: SnapConfig = {
  bundler: "webpack",
  input: "snap/index.ts",
  polyfills: {
    buffer: true,
    stream: true,
    crypto: true,
  },
  environment: {
    DAPP_ORIGIN_PRODUCTION: 'https://tss.ac',
    DAPP_ORIGIN_DEVELOPMENT: 'http://localhost:7070',
  },
  output: {
    path: "bundle",
  },
  server: {
    port: 9000,
  },
};

export default config;
