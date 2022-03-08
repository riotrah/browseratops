import { execFile } from 'child_process'
import path from 'path'

import type { AppId } from '../../config/apps'
import { appHasWin, apps } from '../../config/apps'
import { getOS } from '../../shared/utils/platform-utils'

export function openApp(
  appId: AppId,
  url: string,
  isAlt: boolean,
  isShift: boolean,
): void {
  const selectedApp = apps[appId]

  const convertedUrl =
    'convertUrl' in selectedApp ? selectedApp.convertUrl(url) : url

  switch (getOS().os) {
    case 'win32': {
      if (appHasWin(selectedApp)) {
        const { win } = selectedApp
        const { path: winPath, filename } = win

        const filePath = path.join(winPath, filename)

        const _openArguments = [
          isShift && 'privateArg' in selectedApp
            ? selectedApp.privateArg // eslint-disable-line unicorn/consistent-destructuring
            : '',
          convertedUrl,
        ] as const

        const openArguments = _openArguments.filter(Boolean).flat()

        // "C:\program files\Google\Chrome\Application\chrome.exe" --profile-directory=Default msn.com
        execFile(filePath, openArguments)
      } else {
        throw new Error(`App ${appId} does not have a win config`)
      }

      break
    }

    case 'darwin': {
      const _openArguments = [
        '-b',
        appId,
        isAlt ? '--background' : [],
        isShift && 'privateArg' in selectedApp
          ? (['--new', '--args', selectedApp.privateArg] as const)
          : [],
        // In order for private/incognito mode to work the URL needs to be passed
        // in last, _after_ the respective app.privateArg flag
        convertedUrl,
      ] as const

      const openArguments = _openArguments.filter(Boolean).flat()

      execFile('open', openArguments)
      break
    }

    default: {
      throw new Error(`Unsupported OS: ${getOS().os}`)
    }
  }
}
