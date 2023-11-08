import init, {
  keygen,
  sign,
  generateKeypair,
  createMeeting,
  joinMeeting,
} from "@mpc-sdk/mpc-bindings";
import * as Comlink from "comlink";

console.log("Worker is initializing...");
void (async function () {
  await init();
  self.postMessage({ ready: true });
})();

Comlink.expose({
  keygen,
  sign,
  generateKeypair,
  createMeeting,
  joinMeeting,
});
