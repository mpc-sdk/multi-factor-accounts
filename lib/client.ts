import { ServerOptions, MeetingOptions } from "@/app/model";

// Cache of server options.
let serverOptions: ServerOptions = null;
let keypair: string = null;

export type WebassemblyWorker = {
  generateKeypair: () => Promise<string>;
  createMeeting: (
    options: MeetingOptions,
    identifiers: string[],
    initiator: string,
  ) => Promise<string>;
};

// Convert from a ws: (or wss:) protocol to http: or https:.
export function convertUrlProtocol(server: string): string {
  const url = new URL(server);
  if (url.protocol === "ws:") {
    url.protocol = "http:";
  } else if (url.protocol === "wss:") {
    url.protocol = "https:";
  }
  return url.toString().replace(/\/+$/, "");
}

// Get the public key of the backend server and cache the result.
export async function fetchServerPublicKey(
  serverUrl: string,
): Promise<ServerOptions> {
  if (serverOptions != null && serverOptions.serverUrl === serverUrl) {
    return serverOptions;
  }

  let url = convertUrlProtocol(serverUrl);
  url = `${url}/public-key`;
  const response = await fetch(url);

  if (response.status !== 200) {
    throw new Error(
      `unexpected status code fetching public key: ${response.status}`,
    );
  }
  const serverPublicKey = await response.text();
  serverOptions = {
    serverUrl: serverUrl,
    serverPublicKey,
  };
  return serverOptions;
}

// Generate a keypair or return a cached session keypair.
export async function generateKeypair(
  worker: WebassemblyWorker,
): Promise<string> {
  if (keypair !== null) {
    return keypair;
  }
  keypair = await worker.generateKeypair();
  return keypair;
}

// Create a meeting point for public key exchange.
export async function createMeeting(
  worker: WebassemblyWorker,
  serverUrl: string,
  identifiers: string[],
  initiator: string,
): Promise<string> {
  const server = await fetchServerPublicKey(serverUrl);
  const keypair = await generateKeypair(worker);
  const options: MeetingOptions = {
    server,
    keypair,
  };

  console.log(identifiers);
  console.log(initiator);

  return await worker.createMeeting(options, identifiers, initiator);
}
