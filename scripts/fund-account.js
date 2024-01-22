const ethers = require('ethers');
const { parseEther, getDefaultProvider } = ethers;

async function fundAccount(privateKey, to, amount) {
  const provider = getDefaultProvider("http://127.0.0.1:8545");
  const wallet = new ethers.Wallet(privateKey, provider);
  //const balance = await provider.getBalance(to);
  //const nonce = await provider.getTransactionCount(to);
  //const value = utils.parseUnits(amount);
  const tx = {
    to,
    value: parseEther(amount)
  };
  const result = await wallet.sendTransaction(tx);
  console.log(result);
}

// Private key from Ganache, usually at index zero
const from = "0xD928Bb02420d5b4E50AdFD3ca9567d60C6590550";
const privateKey = "0xf64abc91d673bcf100c3cf2bc42507df566d36a18189ae41c377c55ee26a44fd";


// Address we want to fund - the MPC address
const to = "0x560e9f09aa2177e3372f84b8c3dbb9375ee373cf";

// Send 1 ETH
fundAccount(privateKey, to, "10.0");
