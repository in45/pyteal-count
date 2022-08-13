const { convert } = require("@algo-builder/algob");
const { Runtime, AccountStore } = require("@algo-builder/runtime");
const { types } = require("@algo-builder/web");
const { assert } = require("chai");
const algosdk = require("algosdk");
const commonfn = require("./helper");

const approvalFile = "counter_approval.py";
const clearStateFile = "counter_clearstate.py";

describe("Stateful Smart Contract Counter Tests", function () {
    let master;
    let acc1;
    let runtime;

    // do this before each test
    this.beforeEach(async function () {
        master = new AccountStore(100e6); //100 Algos
        acc1 = new AccountStore(10e6); //10 Algos
        runtime = new Runtime([master, acc1]);
    });

    const initContract = () => {
        return commonfn.initCounterContract(
            runtime, 
            master.account, 
            approvalFile, 
            clearStateFile
        );
    };

    const getGlobal = (appID, key) => runtime.getGlobalState(appID, key);

    it("Deploys counter contract successfully", () => {
        const appInfo = initContract();
        const appID = appInfo.appID;

        // verify app created
        assert.isDefined(appID);
      //  assert.equal(getGlobal(appID, "owner"), master.account); 
        assert.equal(getGlobal(appID, "counter"), 0);

        // verify app funded
        const appAccount = runtime.getAccount(appInfo.applicationAccount);

        assert.equal(appAccount.amount, 2e7);
// sync account
        master = runtime.getAccount(master.address);
 assert.equal(master.amount, 8e7-1000);
   });

 

    it("Increment counter successfully", () => {
        const appInfo = initContract();
        const appID = appInfo.appID;

        // call increment
        commonfn.increment(runtime, acc1.account, appID);

        assert.equal(getGlobal(appID, "counter"), 1);

    });


});
