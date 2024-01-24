import { recoverAddress } from 'ethers';

const digest = "0x2358f64683888bea1f1457e9dde4b8f908e60cf870da5b1a8703db746385401d";
const signature = {
    "r": "0xf18fc2d55f77bd30c599bd81beafcd579ffb36cee49b549476a77e2b11b5ca70",
    "s": "0x3c43ecf79a122f48816ae64f546f96074460a6268b571e69b6c700f30a1e9be9",
    "v": 27
};

const recoveredAddress = recoverAddress(digest, signature);
console.log({recoveredAddress});
