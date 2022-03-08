import { createReducer } from '@reduxjs/toolkit'

import { CARROT_URL } from '../../config/CONSTANTS'
import {
  availableUpdate,
  downloadedUpdate,
  downloadingUpdate,
  gotDefaultBrowserStatus,
  openedUrl,
  receivedRendererStartupSignal,
  retrievedInstalledApps,
  startedScanning,
} from '../../main/state/actions'
import {
  clickedDonate,
  pressedKey,
  startedPicker,
} from '../../renderers/picker/state/actions'
import {
  clickedTabButton,
  confirmedReset,
  startedPrefs,
} from '../../renderers/prefs/state/actions'
import { gotKeyLayoutMap, openURL } from '../../renderers/shared/state/actions'
import { backspaceUrlParse } from '../utils/backspace-url-parse'

export type PrefsTab = 'about' | 'apps' | 'general'

export interface Data {
  version: string
  updateStatus: 'available' | 'downloaded' | 'downloading' | 'no-update'
  isDefaultProtocolClient: boolean
  url: string
  pickerStarted: boolean
  prefsStarted: boolean
  prefsTab: PrefsTab
  keyCodeMap: Record<string, string>
  scanStatus: 'init' | 'scanned' | 'scanning'
}

export const defaultData: Data = {
  version: '',
  updateStatus: 'no-update',
  isDefaultProtocolClient: true,
  url: '',
  pickerStarted: false,
  prefsStarted: false,
  prefsTab: 'general',
  keyCodeMap: {},
  scanStatus: 'init',
}

export const data = createReducer<Data>(defaultData, (builder) =>
  builder
    .addCase(receivedRendererStartupSignal, (_, action) => action.payload.data)

    .addCase(confirmedReset, () => defaultData)

    .addCase(startedScanning, (state) => {
      state.scanStatus = 'scanning'
    })

    .addCase(retrievedInstalledApps, (state) => {
      state.scanStatus = 'scanned'
    })

    .addCase(startedPicker, (state) => {
      state.pickerStarted = true
    })

    .addCase(startedPrefs, (state) => {
      state.prefsStarted = true
    })

    // Pressed key in picker window
    .addCase(pressedKey, (state, action) => {
      if (action.payload.physicalKey === 'Backspace') {
        state.url = backspaceUrlParse(state.url)
      }
    })

    .addCase(gotDefaultBrowserStatus, (state, action) => {
      state.isDefaultProtocolClient = action.payload
    })

    .addCase(availableUpdate, (state) => {
      state.updateStatus = 'available'
    })

    .addCase(downloadingUpdate, (state) => {
      state.updateStatus = 'downloading'
    })

    .addCase(downloadedUpdate, (state) => {
      state.updateStatus = 'downloaded'
    })

    .addCase(openedUrl, (state, action) => {
      state.url = action.payload
    })

    .addCase(clickedDonate, (state) => {
      state.url = CARROT_URL
    })

    .addCase(openURL, (state, action) => {
      state.url = action.payload
    })

    .addCase(clickedTabButton, (state, action) => {
      state.prefsTab = action.payload
    })

    .addCase(gotKeyLayoutMap, (state, action) => {
      state.keyCodeMap = action.payload
    }),
)
