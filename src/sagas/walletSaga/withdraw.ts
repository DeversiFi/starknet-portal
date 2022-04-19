import { put } from '@redux-saga/core/effects'
import { PayloadAction } from '@reduxjs/toolkit'

import { initiateWithdraw, withdraw } from '../../api/bridge'
import { NOTIFICATIONS } from '../../constants/notifications'
import { TransactionStatuses } from '../../enums/TransactionStatuses'
import { addWithdrawal, updateWithdrawal } from '../../redux/slices/bridgeSlice'
import { NotificationStatuses } from '../../redux/slices/notifications.types'
import { addNotification, updateNotification } from '../../redux/slices/notificationsSlice'
import { WithdrawPayload } from '../../redux/slices/walletSlice.types'
import { store } from '../../store'
import { ABIS } from '../../utils/abis'
import { l1_getContract, l2_getContract } from '../../utils/contract'
import { waitForTransaction } from '../../utils/events'
import { Layers } from '../../utils/layer'
import { getTokenDetails } from '../../utils/tokens'
import { chainId } from './approval'

export function * handleInitiateWithdraw (action: PayloadAction<WithdrawPayload>) {
  const { toAddress, amount, token } = action.payload

  const tokenDetails = getTokenDetails(Layers.L2, token)
  const tokenBridgeAddress = tokenDetails.bridgeAddress[chainId]

  const contract = l2_getContract(tokenBridgeAddress, ABIS.L2_TOKEN_BRIDGE)

  const { transaction_hash: transactionHash } = yield initiateWithdraw({
    recipient: toAddress,
    amount: amount.toString(),
    decimals: tokenDetails.decimals,
    contract
  })

  yield put(addNotification({
    id: NOTIFICATIONS.WITHDRAWAL_L2,
    title: 'Initiating withdrawal on L2',
    status: NotificationStatuses.PENDING,
    meta: {
      txHashL2: transactionHash,
      token,
      description: `${amount} ${token}`
    }
  }))
  yield put(addWithdrawal({
    transactions: {
      [Layers.L2]: {
        hash: transactionHash,
        status: TransactionStatuses.PENDING
      }
    },
    amount,
    token,
    toAddress
  }))

  waitForTransaction(transactionHash).then((res) => {
    console.log('L2 transaction completed')

    // Update deposit L2 transaction
    store.dispatch(updateWithdrawal({
      transactions: {
        [Layers.L2]: {
          status: TransactionStatuses.COMPLETED
        }
      }
    }))

    // Update L2 notification
    store.dispatch(updateNotification({
      id: NOTIFICATIONS.WITHDRAWAL_L2,
      title: 'Withdrawal ready to be claimed on L1.',
      status: NotificationStatuses.SUCCESS
    }))
  })
}

export function * handleClaimWithdraw (action: PayloadAction<WithdrawPayload>) {
  const { toAddress, amount, token } = action.payload

  const tokenDetails = getTokenDetails(Layers.L1, token)
  const tokenBridgeAddress = tokenDetails.bridgeAddress[chainId]

  const contract = l1_getContract(tokenBridgeAddress, ABIS.L1_ERC20_BRIDGE)

  yield withdraw({
    recipient: toAddress,
    amount,
    decimals: tokenDetails.decimals,
    contract,
    emitter: (error: Error, transactionHash: string) => {
      if (!error) {
        console.log('Tx hash received', { transactionHash })
        store.dispatch(addNotification({
          id: NOTIFICATIONS.WITHDRAWAL_L1,
          title: 'Completing withdrawal on L1',
          status: NotificationStatuses.PENDING,
          meta: {
            txHashL1: transactionHash,
            token,
            description: `${amount} ${token}`
          }
        }))
        store.dispatch(updateWithdrawal({
          transactions: {
            [Layers.L1]: {
              hash: transactionHash,
              status: TransactionStatuses.PENDING
            }
          }
        }))
      }
    }
  })
}
