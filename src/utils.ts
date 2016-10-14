import { Dictionary } from './declarations'

export const modulePrefix = 'local'

export function localKey (key: string, moduleName: string): string {
  return [modulePrefix, moduleName, key].join('/')
}

export function assign <T extends Object, V extends Object>(a: T, b: V): T & V {
  const _a: any = a
  const _b: any = b
  Object.keys(_b).forEach(key => {
    _a[key] = _b[key]
  })
  return _a
}

export function mapKeys <T>(
  obj: Dictionary<T>,
  f: (value: T, key: string) => string
): Dictionary<T> {
  const res: Dictionary<T> = {}
  Object.keys(obj).forEach(key => {
    res[f(obj[key], key)] = obj[key]
  })
  return res
}

export function mapValues <T, U>(
  obj: Dictionary<T>,
  f: (value: T, key: string) => U
): Dictionary<U> {
  const res: Dictionary<U> = {}
  Object.keys(obj).forEach(key => {
    res[key] = f(obj[key], key)
  })
  return res
}

export function isObject (value: any): boolean {
  return value !== null && typeof value === 'object'
}

export function warn (message: string): void {
  console.error('[vuex-local] ' + message)
}

export function assert (condition: any, message: string): void {
  if (!condition) {
    throw new Error('[vuex-local] ' + message)
  }
}
