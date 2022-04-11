import { put } from '@redux-saga/core/effects'
import { PayloadAction } from '@reduxjs/toolkit'

import { allowance, approve } from '../../api/erc20'
import { fetchAllowance, setAllowance } from '../../redux/slices/walletSlice'
import { ApproveTokenPayload, FetchAllowancePayload } from '../../redux/slices/walletSlice.types'
import { l1_getContract, l2_getContract } from '../../utils/contract'
import { Layers, layerSwitch } from '../../utils/layer'
import { getTokenDetails } from '../../utils/tokens'

const ERC20ABIL1 = require('../../abis/l1/ERC20.json')
const ERC20ABIL2 = require('../../abis/l2/ERC20.json')

const MAX_ALLOWED_VALUE = 2 ** 256 - 1 // TODO: refactor

export const chainId = 5 // TODO: refactor chain id to store

export function * handleFetchAllowance (action: PayloadAction<FetchAllowancePayload>) {
  const { token, address } = action?.payload

  if (!token || token === 'ETH') {
    yield put(
      setAllowance({
        token,
        allowance: MAX_ALLOWED_VALUE
      })
    )
  } else {
    try {
      const tokenDetails = getTokenDetails(Layers.L1, token)
      if (tokenDetails && tokenDetails.tokenAddress) {
        const contract = l1_getContract(
          tokenDetails.tokenAddress[chainId],
          ERC20ABIL1
        )

        const allowanceRes = yield allowance({
          owner: address,
          spender: tokenDetails.bridgeAddress[chainId],
          decimals: tokenDetails.decimals,
          contract
        })

        yield put(
          setAllowance({
            token,
            allowance: allowanceRes
          })
        )
      }
    } catch (error) {
      console.error("Couldn't get token allowance", error)
    }
  }
}

export function * handleApproveToken (action: PayloadAction<ApproveTokenPayload>) {
  const { layer, token, address } = action?.payload

  const tokenDetails = getTokenDetails(layer, token)
  if (tokenDetails && tokenDetails.tokenAddress) {
    const contract = layerSwitch(layer, l1_getContract, l2_getContract)(
      tokenDetails.tokenAddress[chainId],
      layerSwitch(layer, ERC20ABIL1, ERC20ABIL2)
    )

    yield approve({
      spender: tokenDetails.bridgeAddress[chainId],
      value: MAX_ALLOWED_VALUE.toString(16),
      contract,
      options: {
        from: address
      }
    })
    yield put(fetchAllowance({ token, address }))
  }
}
