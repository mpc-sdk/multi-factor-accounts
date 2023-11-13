import * as z from "zod";

export function schemaGG20() {
  const point = z.object({
    curve: z.string(),
    point: z.string(),
  });

  const scalar = z.object({
    curve: z.string(),
    scalar: z.string(),
  });

  const n = z.object({
    n: z.string(),
  });

  const h1_h2_n_tilde = z.object({
    modulus: z.string(),
    base: z.string(),
    value: z.string(),
  });

  return z.object({
    privateKey: z.object({
      gg20: z.object({
        paillier_dk: z.object({
          p: z.string(),
          q: z.string(),
        }),
        pk_vec: z.array(point),
        keys_linear: z.object({
          y: point,
          x_i: scalar,
        }),
        paillier_key_vec: z.array(n),
        y_sum_s: point,
        h1_h2_n_tilde_vec: z.array(h1_h2_n_tilde),
        vss_scheme: z.object({
          parameters: z.object({
            threshold: z.number(),
            share_count: z.number(),
          }),
          commitments: z.array(point),
          proof: z.object({
            pk: point,
            pk_t_rand_commitment: point,
            challenge_response: scalar,
          }),
        }),
        i: z.number(),
        t: z.number(),
        n: z.number(),
      }),
    }),
    publicKey: z.array(z.number()),
    address: z.string(),
  });
}
