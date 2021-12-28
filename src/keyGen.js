const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const key = ec.genKeyPair();
console.log("\n", key.getPublic("hex"), "\n\n", key.getPrivate("hex"));
