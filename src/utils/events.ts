import { defaultProvider, hash, number } from 'starknet'
import { Contract as L1Contract, EventData } from 'web3-eth-contract'

import { ChainType } from '../enums/ChainType'

export const listenContractEvent = (
  contract: L1Contract,
  eventName: string,
  filter = {},
  handler: (error: Error, event: EventData) => void
) => {
  contract.events[eventName]({ filter }, handler)
}

export const getTransactionHash = (
  txHashPrefix: string,
  fromAddress: string,
  toAddress: string,
  selector: any,
  payload: any,
  ...additionalData: any
) => {
  const calldata = [number.hexToDecimalString(fromAddress), ...payload]
  const calldataHash = hash.computeHashOnElements(calldata)
  return hash.computeHashOnElements([
    txHashPrefix,
    0, // version
    toAddress,
    selector,
    calldataHash,
    0, // max_fee
    ChainType.GOERLI.l2IdPrefix,
    ...additionalData
  ])
}

export const waitForTransaction = async (transactionHash: string, requiredStatus = 'RECEIVED', retryInterval = 5000) => {
  return new Promise((resolve, reject) => {
    let processing = false
    const intervalId = setInterval(async () => {
      if (processing) return
      const statusPromise = defaultProvider.getTransactionStatus(transactionHash)
      processing = true
      try {
        const { tx_status } = await statusPromise
        if (tx_status === requiredStatus) {
          clearInterval(intervalId)
          resolve(tx_status)
        } else if (tx_status === 'REJECTED') {
          clearInterval(intervalId)
          reject(new Error('Transaction failed'))
        } else {
          processing = false
        }
      } catch (ex) {
        processing = false
      }
    }, retryInterval)
  })
}
