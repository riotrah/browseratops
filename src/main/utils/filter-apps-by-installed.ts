import appExists from 'app-exists'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

import type { AppId, Apps } from '../../config/apps'
import { appHasWin } from '../../config/apps'
import { getKeys } from '../../shared/utils/get-keys'
import { getOS } from '../../shared/utils/platform-utils'

export const doesAppExist = async (
  apps: Apps,
  appId: AppId & string,
): Promise<boolean> => {
  const app = apps[appId]

  let doesExist: boolean
  const { os } = getOS()

  switch (os) {
    case 'win32':
      if (appHasWin(app)) {
        const { path: winPath, filename } = app.win
        doesExist = await promisify(fs.exists)(path.join(winPath, filename))
      } else {
        doesExist = false
      }

      break

    case 'darwin':
      doesExist = await appExists(appId)
      break

    default:
      throw new Error(`Unsupported OS: ${os}`)
      break
  }

  return doesExist
}

/**
 * Finds installed whitelisted apps.
 */
export async function filterAppsByInstalled(apps: Apps): Promise<AppId[]> {
  const installedAppIds: AppId[] = []

  for await (const appId of getKeys(apps)) {
    if (await doesAppExist(apps, appId)) {
      installedAppIds.push(appId)
    }
  }

  return installedAppIds
}
