const BigNumber = require('bignumber.js')
const uuidv4 = require('uuid')

const SYMBOLS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
const UUID_BASE16 = 16
const RE_UUID_NO_HYPHEN = /^([a-f0-9]{8})([a-f0-9]{4})([a-f0-9]{4})([a-f0-9]{4})([a-f0-9]{12})$/
const RE_UUID_WITH_HYPHEN = '$1-$2-$3-$4-$5'

const computeLengthFromBase = (base) => Math.ceil(Math.log(Math.pow(16, 32)) / Math.log(base))

const create = ({ uuid = null, base = 64 } = {}) => {
  if (base > SYMBOLS.length) {
    throw new Error(`Invalid base: ${base}. Must be between 2 and ${SYMBOLS.length}.`)
  }
  if (!uuid) uuid = uuidv4()
  const length = computeLengthFromBase(base)
  uuid = uuid.replace(/-/g, '').toLowerCase()
  let pid = baseToBase(uuid, UUID_BASE16, base)
  return '' + pid.padStart(length, '0')
}

const compact = () => create()
const simple = () => create({ base: 36 })

const toUuid = (pid, base) => {
  let uuid = baseToBase(pid, base, UUID_BASE16)
  uuid = uuid.padStart(32, '0')
  if (uuid.length > 32) {
    const max = create({ uuid: 'ffffffff-ffff-ffff-ffff-ffffffffffff', base })
    throw new Error(`Invalid PID '${pid}'. Maximum PID value using base '${base}' is '${max}'.`)
  }
  return '' + uuid.replace(RE_UUID_NO_HYPHEN, RE_UUID_WITH_HYPHEN)
}

const baseToBase = (digits, fromBase, toBase) => {
  return valueToForm(formToValue(digits, fromBase), toBase);
}

const valueToForm = (value, base) => {
  if (!(value instanceof BigNumber)) value = BigNumber(value)
  let digits = ''
  while (value.comparedTo(0) > 0) {
    const quotient = value.idiv(base)
    const remainder = value.mod(base)
    digits = SYMBOLS[remainder] + digits
    value = quotient
  }
  return digits
}

const formToValue = (digits, base) => {
  const subset = SYMBOLS.substring(0, base)
  let value = BigNumber(0)
  for (let c of digits) {
    const index = subset.indexOf(c)
    if (index === -1) {
      throw new Error(`Invalid digit '${c}', not found in '${base}' digits '${subset}'.`)
    }
    value = value.times(base).plus(index)
  }
  return value
}

module.exports = { create, compact, simple, toUuid, computeLengthFromBase };
