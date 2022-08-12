from pyteal import *

def approval():

    global_owner = Bytes("owner")  # byteslice
    global_counter = Bytes("counter")  # uint64

    op_increment = Bytes("inc")
    op_decrement = Bytes("dec")
    '''
    Initialization
    '''
    handle_creation = Seq(
            [
                App.globalPut(global_owner, Txn.sender()),
                App.globalPut(global_counter, Int(0)),
                Approve(),
            ]
        )

    handle_optin = Seq([
        Assert(App.optedIn(Txn.sender(), Txn.application_id())),
        Return(Int(1))
    ])

   increment = Seq(
        [
            App.globalPut(global_counter, App.globalGet(global_counter) + Int(1)),
            Approve(),
        ]
    )

    decrement = Seq(
        [
            App.globalPut(global_counter, App.globalGet(global_counter) - Int(1)),
            Approve(),
        ]
    )

    handle_noop = Cond(
            [Txn.application_args[0] == op_increment, increment],
            [Txn.application_args[0] == op_decrement, decrement],
        )
    handle_closeout = Return(Int(1))
    handle_updateapp = Return(Int(0))
    handle_deleteapp = Return(Int(0))

    program = Cond(
        [Txn.application_id() == Int(0), handle_creation],
        [Txn.on_completion() == OnComplete.OptIn, handle_optin],
        [Txn.on_completion() == OnComplete.CloseOut, handle_closeout],
        [Txn.on_completion() == OnComplete.UpdateApplication, handle_updateapp],
        [Txn.on_completion() == OnComplete.DeleteApplication, handle_deleteapp],
        [Txn.on_completion() == OnComplete.NoOp, handle_noop]
    )

    return program

if __name__ == "__main__":
    print(compileTeal(approval(), mode=Mode.Application, version=6))