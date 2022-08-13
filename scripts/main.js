const { executeTransaction } = require("@algo-builder/algob");
const { types } = require("@algo-builder/web");

async function run (runtimeEnv, deployer) {
  // accounts involved
  const master = deployer.accountsByName.get("master");
  const acc1 = deployer.accountsByName.get("acc1");
  const acc2 = deployer.accountsByName.get("acc2");

  // supply params to program during compilation - not the same as passing arguments
  const templateParams = {
    RECEVIER_1: acc1.addr,
    RECEIVER_2: acc2.addr
  }
  
  // create logic sig for sender account
  const masterLogicSig = await deployer.mkDelegatedLsig(
    "counter_approval.py",
    master,
    templateParams
  );

console.log(masterLogicSig.contractAddress)

}

module.exports = { default: run };
