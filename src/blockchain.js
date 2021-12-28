const cHASH = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Transaction {
  constructor(fromAdd, toAdd, amount) {
    this.fromAdd = fromAdd;
    this.toAdd = toAdd;
    this.amount = amount;
  }

  calchash() {
    return cHASH(this.fromAdd, this.toAdd, this.amount).toString();
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic("hex") !== this.fromAdd) {
      throw new Error("UnAuthorised User Transaction Attempt");
    }

    const hash = this.calchash();
    const sig = signingKey.sign(hash, "base64");
    this.signature = sig.toDER("hex");
  }
}

class Block {
  constructor(transaction) {
    this.timestamp = Date.now();
    this.transaction = transaction;
    this.previoushash = "";
    this.hash = this.calchash();
    this.nonce = 0;
  }

  calchash() {
    return cHASH(
      this.timestamp +
        JSON.stringify(this.transaction) +
        this.previoushash +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calchash();
    }
    console.log("Block Mined: " + this.hash);
  }
}

class Chain {
  constructor() {
    this.chain = [this.GenisisBlock()];
    this.difficulty = 3;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  GenisisBlock() {
    return new Block("G");
  }

  getLast() {
    return this.chain[this.chain.length - 1];
  }

  miningPendingTransactions(miningRewardAddress) {
    let block = new Block(this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log("Block Mined Successful!");
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalance(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transaction) {
        if (trans.fromAdd == address) {
          balance -= trans.amount;
        }
        if (trans.toAdd == address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }

  checkChain() {
    for (let i = 1; i < this.chain.length; i++) {
      let currentBlock = this.chain[i];
      let previousBlock = this.chain[i - 1];

      if (currentBlock.hash != currentBlock.calchash()) return false;
      if (currentBlock.previoushash != previousBlock.hash) return false;
      return true;
    }
  }
}

module.exports.Chain = Chain;
module.exports.Transaction = Transaction;
