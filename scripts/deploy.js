const { executeTransaction, convert } = require("@algo-builder/algob");
const { types } = require("@algo-builder/web");

async function run(runtimeEnv, deployer) {
    const master = deployer.accountsByName.get("master");
    const approvalFile = "counter_approval.py";
    const clearStateFile = "counter_clearstate.py";

    await deployer.deployApp(
        approvalFile,
        clearStateFile,
        {
            sender: master,
            localInts: 0,
            localBytes: 0,
            globalInts: 1,
            globalBytes: 1,
            appArgs: [],
        },
        { totalFee: 1000 }
    );

    // get app info
    const counterApp = deployer.getApp(approvalFile, clearStateFile);
    const counterAppAddress = counterApp.applicationAccount;
    console.log("app account address:", counterAppAddress);

    // fund account with 20 algos
    await executeTransaction(deployer, {
        type: types.TransactionType.TransferAlgo,
        sign: types.SignType.SecretKey,
        fromAccount: master,
        toAccountAddr: counterAppAddress,
        amountMicroAlgos: 2e7, //20 algos
        payFlags: { totalFee: 1000 },
    });

    // get app account balance
    let appAccount = await deployer.algodClient.accountInformation(counterAppAddress).do();
    console.log(appAccount);
}

module.exports = { default: run };
