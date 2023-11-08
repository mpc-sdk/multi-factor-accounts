import { ServerOptions } from '@/app/model';

// Cache of server options.
let serverOptions: ServerOptions = null;

// Convert from a ws: (or wss:) protocol to http: or https:.
export function convertUrlProtocol(server: string): string {
  const url = new URL(server);
  if (url.protocol === 'ws:') {
    url.protocol = "http:";
  } else if (url.protocol === 'wss:') {
    url.protocol = "https:";
  }
  return url.toString().replace(/\/+$/, "");
}

// Get the public key of the backend server.
export async function fetchServerPublicKey(serverUrl: string): Promise<ServerOptions> {
  if (serverOptions != null && serverOptions.serverUrl === serverUrl) {
    return serverOptions;
  }

  let url = convertUrlProtocol(serverUrl);
  url = `${url}/public-key`;
  const response = await fetch(url);

  if (response.status !== 200) {
    throw new Error(
      `unexpected status code fetching public key: ${response.status}`);
  }
  const serverPublicKey = await response.text();
  serverOptions = {
    serverUrl: serverUrl,
    serverPublicKey,
  };
  return serverOptions;
}
