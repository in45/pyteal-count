const { convert } = require("@algo-builder/algob");
const { types } = require("@algo-builder/web");

const initCounterContract = (runtime, creatorAccount, approvalFile, clearStateFile) => {

    // deploy contract
    runtime.deployApp(
        approvalFile,
        clearStateFile,
        {
            sender: creatorAccount,
            localInts: 0,
            localBytes: 0,
            globalInts: 1,
            globalBytes: 1,
            appArgs: [],
        },
        { totalFee: 1000 }, //pay flags
        {} //smart contract template params
    );

    const appInfo = runtime.getAppInfoFromName(approvalFile, clearStateFile);
    const appAddress = appInfo.applicationAccount;

    // fund the contract
    runtime.executeTx({
        type: types.TransactionType.TransferAlgo,
        sign: types.SignType.SecretKey,
        fromAccount: creatorAccount, //use the account object
        toAccountAddr: appAddress, //app address
        amountMicroAlgos: 2e7, //20 algos
        payFlags: { totalFee: 1000 },
    });

    return appInfo;
};

const increment = (runtime, account, appID) => {
    const incAppArgs = ["inc"].map(convert.stringToBytes);
    runtime.executeTx({
        type: types.TransactionType.CallApp,
        sign: types.SignType.SecretKey,
        fromAccount: account,
        appID: appID,
        payFlags: { totalFee: 1000 },
        appArgs: incAppArgs,
    });
};

module.exports = {
    initCounterContract,
    increment
}