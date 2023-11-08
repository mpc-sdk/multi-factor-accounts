
// Convert from a ws: (or wss:) protocol to http: or https:.
export function convertUrlProtocol(server: string): string {
  let url = new URL(server);
  if (url.protocol === 'ws:') {
    url.protocol = "http:";
  } else if (url.protocol === 'wss:') {
    url.protocol = "https:";
  }
  return url.toString().replace(/\/+$/, "");
}

// Get the public key of the backend server.
export async function fetchServerPublicKey(server: string): string {
  let url = convertUrlProtocol(server);
  url = `${url}/public-key`;
  const response = await fetch(url);

  if (response.status !== 200) {
    throw new Error(
      `unexpected status code fetching public key: ${response.status}`);
  }
  return await response.text();
}
