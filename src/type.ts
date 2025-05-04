import { IotaClient } from "@iota/iota-sdk/client"

export interface ButtonType {
    transferField: boolean,
    setTransferField: React.Dispatch<React.SetStateAction<boolean>>,
    showBalance: boolean,
    setShowBalance: React.Dispatch<React.SetStateAction<boolean>>,
    mintField: boolean
    setMintField: React.Dispatch<React.SetStateAction<boolean>>
}

export interface TransactionType {
    address: string,
    setAddress: React.Dispatch<React.SetStateAction<string>>,
    amount: number,
    setAmount: React.Dispatch<React.SetStateAction<string>>
    packageId:never,
    coinAddress?:any,
    treasuryCap?:any,
    signAndExecuteTransaction:any,
    client:IotaClient
}

export interface TranferProp {
    setTransferField:  React.Dispatch<React.SetStateAction<boolean>>,
}