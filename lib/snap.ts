import snapPackageInfo from "../package.json";

export const defaultSnapId =
  process.env.SNAP_ID || `local:${location.protocol}//${location.host}/`;

export type GetSnapsResponse = Record<string, Snap>;

export type Snap = {
  permissionName: string;
  id: string;
  version: string;
  initialPermissions: Record<string, unknown>;
};

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await ethereum.request({
    method: "wallet_getSnaps",
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapId,
  params: Record<"version" | string, unknown> = {
    version: snapPackageInfo.version,
  },
) => {
  console.log("Connect to snap", snapId);
  await ethereum.request({
    method: "wallet_requestSnaps",
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapId && (!version || snap.version === version),
    );
  } catch (error) {
    console.log("Failed to obtain installed snap", error);
    return undefined;
  }
};

export const isLocalSnap = (snapId: string) => snapId.startsWith("local:");
