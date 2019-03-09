export { create, compact, simple, toUuid };

declare function create({ uuid: string = null, base: number = 64 } = {})
declare function compact()
declare function simple()
declare function toUuid(pid: string, base: number)
