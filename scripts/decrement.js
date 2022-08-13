const { executeTransaction, convert, readAppGlobalState, readAppLocalState } = require("@algo-builder/algob");
const { types } = require("@algo-builder/web");

async function run(runtimeEnv, deployer) {
    const master = deployer.accountsByName.get("master");
    const acc1 = deployer.accountsByName.get("acc1");
    const approvalFile = "counter_approval.py";
    const clearStateFile = "counter_clearstate.py";

    // get app info
    const counterApp = deployer.getApp(approvalFile, clearStateFile);
    const appID = counterApp.appID;
    let globalState = await readAppGlobalState(deployer, master.addr, appID);
    console.log(globalState);

    // increment
    const incAppArgs = ["dec"].map(convert.stringToBytes);
    await executeTransaction(deployer, {
        type: types.TransactionType.CallApp,
        sign: types.SignType.SecretKey,
        fromAccount: acc1,
        appID: appID,
        payFlags: { totalFee: 1000 },
        appArgs: incAppArgs,
    });

    // get global and local state
    globalState = await readAppGlobalState(deployer, master.addr, appID);
    console.log(globalState);

}

module.exports = { default: run };
