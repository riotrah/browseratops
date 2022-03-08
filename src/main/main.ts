import type { AnyAction } from '@reduxjs/toolkit'
import electron, { app } from 'electron'
import sleep from 'tings/lib/sleep'

import { Channel } from '../shared/state/channels'
import { ifMac, ifWindows } from '../shared/utils/platform-utils'
import { openedUrl, readiedApp } from './state/actions'
import { dispatch, getState } from './state/store'

const environment = process.env.NODE_ENV || 'development'

// If development environment
if (environment === 'development') {
  try {
    // eslint-disable-next-line node/global-require, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    require('electron-reloader')(module, {
      ignore: 'src',
      debug: true,
      watchRenderer: true,
    })
    // eslint-disable-next-line no-empty
  } catch {}
}

// Attempt to fix this bug: https://github.com/electron/electron/issues/20944
ifMac(() => app.commandLine.appendArgument('--enable-features=Metal'))
ifWindows(() => app.disableHardwareAcceleration())

app.on('ready', () => dispatch(readiedApp()))

// App doesn't always close on ctrl-c in console, this fixes that
app.on('before-quit', () => app.exit())

app.on('open-url', (event, url) => {
  event.preventDefault()

  const urlOpener = async () => {
    if (getState().data.pickerStarted) {
      dispatch(openedUrl(url))
    }
    // If B was opened by sending it a URL, the `open-url` electron.app event
    // can be fired before the picker window is ready. Here we wait before trying again.
    else {
      await sleep(500)
      urlOpener()
    }
  }

  urlOpener()
})

/**
 * Enter actions from renderer into main's store's queue
 */
electron.ipcMain.on(Channel.PREFS, (_, action: AnyAction) => dispatch(action))
electron.ipcMain.on(Channel.PICKER, (_, action: AnyAction) => dispatch(action))
