// @flow

// FIXME remove this file! 'helpers/common.js' RLY? :P
import type Transport from '@ledgerhq/hw-transport'

const APDUS = {
  GET_FIRMWARE: [0xe0, 0x01, 0x00, 0x00],
  // we dont have common call that works inside app & dashboard
  // TODO: this should disappear.
  GET_FIRMWARE_FALLBACK: [0xe0, 0xc4, 0x00, 0x00],
}

export type LedgerScriptParams = {
  firmware?: string,
  firmware_key?: string,
  delete?: string,
  delete_key?: string,
  targetId?: string | number,
  name: string,
  version: string,
  icon: string,
  app?: number,
}

/**
 * Retrieve targetId and firmware version from device
 */
export async function getFirmwareInfo(transport: Transport<*>) {
  try {
    const res = await transport.send(...APDUS.GET_FIRMWARE)
    const byteArray = [...res]
    const data = byteArray.slice(0, byteArray.length - 2)
    const targetIdStr = Buffer.from(data.slice(0, 4))
    const targetId = targetIdStr.readUIntBE(0, 4)
    const versionLength = data[4]
    const version = Buffer.from(data.slice(5, 5 + versionLength)).toString()
    return { targetId, version }
  } catch (err) {
    const error = new Error(err.message)
    error.stack = err.stack
    throw error
  }
}