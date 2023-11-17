import * as z from "zod";

const point = z
  .object({
    curve: z.string(),
    point: z.string(),
  })
  .required();

const scalar = z
  .object({
    curve: z.string(),
    scalar: z.string(),
  })
  .required();

const n = z
  .object({
    n: z.string(),
  })
  .required();

const h1_h2_n_tilde = z
  .object({
    modulus: z.string(),
    base: z.string(),
    value: z.string(),
  })
  .required();

const localKey = z
  .object({
    paillier_dk: z
      .object({
        p: z.string(),
        q: z.string(),
      })
      .required(),
    pk_vec: z.array(point),
    keys_linear: z
      .object({
        y: point,
        x_i: scalar,
      })
      .required(),
    paillier_key_vec: z.array(n),
    y_sum_s: point,
    h1_h2_n_tilde_vec: z.array(h1_h2_n_tilde),
    vss_scheme: z.object({
      parameters: z
        .object({
          threshold: z.number(),
          share_count: z.number(),
        })
        .required(),
      commitments: z.array(point),
      proof: z
        .object({
          pk: point,
          pk_t_rand_commitment: point,
          challenge_response: scalar,
        })
        .required(),
    }),
    i: z.number(),
    t: z.number(),
    n: z.number(),
  })
  .required();

const keyShare = z.object({
  gg20: localKey,
});

export const rawKey = z.object({
  privateKey: keyShare,
  publicKey: z.string(),
  address: z.string(),
});

export const parameters = z.object({
  parties: z.number(),
  threshold: z.number(),
});

export const protocolId = z.enum(["gg20"]);

export const privateKey = z.object({
  protocolId: protocolId,
  privateKey: localKey,
  publicKey: z.string(),
  address: z.string(),
  keyshareId: z.string(),
  parameters: parameters,
});

export const keyShares = z
  .object({
    accountName: z.string(),
    privateKey: z.record(privateKey),
  })
  .required({ privateKey: true });

export type KeyShares = z.infer<typeof keyShares>;
export type LocalKey = z.infer<typeof localKey>;
export type RawKey = z.infer<typeof rawKey>;
export type Parameters = z.infer<typeof parameters>;
export type PrivateKey = z.infer<typeof privateKey>;
export type ProtocolId = z.infer<typeof protocolId>;
