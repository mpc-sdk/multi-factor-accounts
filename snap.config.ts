import type { SnapConfig } from "@metamask/snaps-cli";

const config: SnapConfig = {
  bundler: "webpack", // default: 'browserify'
  input: "snap/index.ts",
  output: {
    path: "bundle",
  },
  server: {
    port: 9000,
  },
};

export default config;
