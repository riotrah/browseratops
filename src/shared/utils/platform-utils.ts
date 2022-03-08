/* eslint-disable @typescript-eslint/no-explicit-any */
import { isFunction } from 'lodash'

export function getOS(): {
  os: NodeJS.Platform
  isWindows: boolean
  isMac: boolean
  isLinux: boolean
} {
  const proc =
    // eslint-disable-next-line no-nested-ternary
    'process' in globalThis
      ? process
      : 'electron' in window
      ? (window as typeof window & { electron: { platform: NodeJS.Platform } })
          .electron
      : { platform: 'win32' as const }

  const os = proc.platform
  const isWindows = os === 'win32'
  const isMac = os === 'darwin'
  const isLinux = os === 'linux'

  return {
    os,
    isWindows,
    isMac,
    isLinux,
  }
}

export const ifOS =
  <T>(os: NodeJS.Platform) =>
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    valueOrFunction: T | ((...arguments_: any[]) => T),
    otherwise?: T | undefined,
  ): T | undefined => {
    if (getOS().os === os) {
      return isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction
    }

    return otherwise
  }

export const ifMac = <T>(
  valueOrFunction: T | ((...arguments_: any[]) => T),
  otherwise?: T | undefined,
): T | undefined =>
  ifOS<T>('darwin' as NodeJS.Platform)(valueOrFunction, otherwise)
export const ifWindows = <T>(
  valueOrFunction: T | ((...arguments_: any[]) => T),
  otherwise?: T | undefined,
): T | undefined =>
  ifOS<T>('win32' as NodeJS.Platform)(valueOrFunction, otherwise)
export const ifLinux = <T>(
  valueOrFunction: T | ((...arguments_: any[]) => T),
  otherwise?: T | undefined,
): T | undefined =>
  ifOS<T>('linux' as NodeJS.Platform)(valueOrFunction, otherwise)

/* export function ifMac(function_: () => void): void {
  if (getOS().isMac) {
    function_()
  }
} */

export function switchOS<T>({
  windows,
  mac,
  linux,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  windows?: AnyFunction | T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mac?: AnyFunction | T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  linux?: AnyFunction | T
}): void {
  if (getOS().isWindows) {
    return isFunction(windows) ? windows() : windows
  } else if (getOS().isMac) {
    return isFunction(mac) ? mac() : mac
  } else if (getOS().isLinux) {
    return isFunction(linux) ? linux() : linux
  }
}

export function iconExtension(): string {
  switch (process.platform) {
    case 'win32':
      return '.ico'

    case 'darwin':
      return '.icns'

    case 'linux':
      return '.png'

    default:
      return '.ico'
  }
}
