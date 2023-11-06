import type { SnapConfig } from "@metamask/snaps-cli";

const config: SnapConfig = {
  bundler: "webpack", // default: 'browserify'
  input: "snap.js",
  output: {
    path: "dist",
  },
  server: {
    port: 9000,
  },
};

export default config;
