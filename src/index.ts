import BigInt from 'big-integer'
import { v4 as uuidv4 } from 'uuid'


const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
const UUID_BASE16 = 16
const DEFAULT_BASE = 64
const RE_UUID_NO_HYPHEN = /^([a-f0-9]{8})([a-f0-9]{4})([a-f0-9]{4})([a-f0-9]{4})([a-f0-9]{12})$/
const RE_UUID_WITH_HYPHEN = '$1-$2-$3-$4-$5'

interface PidConfig {
  uuid?: string
  base?: number
}

export const create = (uuidOrConfig?: string | PidConfig) => {
  const uuid: string = (uuidOrConfig
    ? typeof uuidOrConfig === 'string'
      ? uuidOrConfig
      : uuidOrConfig.uuid || uuidv4()
    : uuidv4()
  )
    .replace(/-/g, '')
    .toLowerCase()

  const base = uuidOrConfig
    ? typeof uuidOrConfig === 'string'
      ? DEFAULT_BASE
      : uuidOrConfig.base || DEFAULT_BASE
    : DEFAULT_BASE

  if (base > ALPHABET.length || base < 2) {
    throw new Error(`Invalid base: ${base}. Must be between 2 and ${ALPHABET.length}.`)
  }

  return BigInt(uuid, UUID_BASE16, ALPHABET, true)
    .toString(base, ALPHABET)
    .padStart(computeLengthFromBase(base), '0')
}

export const computeLengthFromBase = (base: number): number => {
  return Math.ceil(Math.log(Math.pow(16, 32)) / Math.log(base))
}

export const toUuid = (pid: string, base: number) => {
  if (typeof pid !== 'string' || !pid.length) {
    throw new Error(`Must provide non-empty string for pid parameter. Found '${pid}' (${typeof pid}).`)
  }

  if (typeof base !== 'number' || base < 2 || base > 64) {
    throw new Error(`Must provide number between 2 and 64 for base parameter. Found '${base}'.`)
  }

  const value = BigInt(pid, base, ALPHABET, true)
    .toString(UUID_BASE16, ALPHABET)
    .padStart(32, '0')

  if (value.length > 32) {
    const max = create({ uuid: 'ffffffff-ffff-ffff-ffff-ffffffffffff', base })
    throw new Error(`Invalid PID '${pid}'. Maximum PID value using base '${base}' is '${max}'.`)
  }

  return value.replace(RE_UUID_NO_HYPHEN, RE_UUID_WITH_HYPHEN)
}

export const compact = () => create({ base: DEFAULT_BASE })
export const simple = () => create({ base: 36 })

export const createPid = create
export const compactPid = compact
export const simplePid = simple
export const pidToUuid = toUuid
