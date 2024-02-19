import { Signature as WasmSignature } from "@/app/model";
import { FeeMarketEIP1559Transaction, JsonTx } from "@ethereumjs/tx";
import {
  toBeHex,
  TransactionLike,
  Transaction,
  SignatureLike,
} from "ethers";

// Convert the signature from webassembly and the transaction data
// into a signed transaction.
export function encodeSignedTransaction(
  tx: TransactionLike,
  result: WasmSignature,
): Transaction {
  const o = { ...tx };
  delete o.from;
  delete o.type;
  const transaction = Transaction.from(o);
  const r = `0x${result.signature.r.scalar}`;
  const s = `0x${result.signature.s.scalar}`;
  const signature: SignatureLike = {
    r,
    s,
    v: 27 + result.signature.recid,
  };
  transaction.signature = signature;
  return transaction;
}

// Serialize a transaction by converting to `@ethereumjs/tx`
// and then to Json.
//
// This is the transaction format we send to MetaMask via the snap
// to approve a transaction.
export function serializeTransaction(tx: Transaction): JsonTx {
  const txData = tx.toJSON();
  const signature = txData.sig;
  delete txData.sig;

  txData.r = signature.r;
  txData.s = signature.s;
  txData.v = toBeHex(signature.v - 27);

  txData.gasLimit = toBeHex(txData.gasLimit);
  txData.maxPriorityFeePerGas = toBeHex(txData.maxPriorityFeePerGas);
  txData.maxFeePerGas = toBeHex(txData.maxFeePerGas);
  txData.value = toBeHex(txData.value);
  txData.chainId = toBeHex(txData.chainId);
  txData.type = toBeHex(2);

  //console.log("txData", txData);

  const transaction = FeeMarketEIP1559Transaction.fromTxData(txData, {});
  return transaction.toJSON();
}
