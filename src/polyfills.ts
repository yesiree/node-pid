declare interface String {
  repeat(count: number): string
  padStart(length: number, padding?: string): string
}

if (!String.prototype.repeat) {
  String.prototype.repeat = function(count: number = 0) {
    if (!this || !count) return ''
    let result = '' + this
    while (--count) result += result
    return result
  }
}

if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(length: number = 0, padding: string = '0') {
    if (this.length > length) {
      return String(this)
    } else {
      length = length - this.length
      if (length > padding.length) {
        padding += padding.repeat(length / padding.length)
      }
      return padding.slice(0, length) + String(this)
    }
  }
}
