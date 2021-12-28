const { Chain, Transaction } = require("./blockchain");

let Ethereum = new Chain();

Ethereum.createTransaction(new Transaction("address1", "address2", 50));

Ethereum.miningPendingTransactions("nam-add");
console.log(Ethereum.getBalance("nam-add"));

console.log("\n\nNEXTTTTTTTT\n\n");

Ethereum.miningPendingTransactions("prav-add");
console.log(Ethereum.getBalance("nam-add"));
console.log(Ethereum.getBalance("prav-add"));

// console.log(Ethereum.checkChain());
