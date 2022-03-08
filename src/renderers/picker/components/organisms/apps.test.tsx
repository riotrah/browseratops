import '../../../shared/preload'

import { fireEvent, render, screen } from '@testing-library/react'
import electron from 'electron'
import cloneDeep from 'lodash/cloneDeep'
import React from 'react'

import { keyLayout } from '../../../../../__fixtures__/key-layout'
import {
  openedUrl,
  receivedRendererStartupSignal,
  retrievedInstalledApps,
} from '../../../../main/state/actions'
import { Channel } from '../../../../shared/state/channels'
import { defaultData } from '../../../../shared/state/reducer.data'
import { addChannelToAction } from '../../../../shared/utils/add-channel-to-action'
import { reorderedApp } from '../../../prefs/state/actions'
import { customWindow } from '../../../shared/custom.window'
import { clickedApp, pressedKey } from '../../state/actions'
import Wrapper from '../_bootstrap'

const originalNavigator = cloneDeep(customWindow.navigator)

beforeAll(() => {
  customWindow.navigator = {
    ...customWindow.navigator,
    keyboard: {
      getLayoutMap: jest
        .fn()
        .mockResolvedValue({ entries: jest.fn().mockReturnValue(keyLayout) }),
    },
  }
})

afterAll(() => {
  customWindow.navigator = originalNavigator
})

test('kitchen sink', () => {
  render(<Wrapper />)
  const win = new electron.BrowserWindow()
  win.webContents.send(
    Channel.MAIN,
    retrievedInstalledApps([
      'org.mozilla.firefox',
      'com.microsoft.edgemac',
      'com.vivaldi.Vivaldi',
    ]),
  )
  // Check apps and app logos shown
  expect(screen.getByAltText('Firefox')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Firefox App' })).toBeVisible()
  expect(screen.getByAltText('Edge')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Edge App' })).toBeVisible()
  expect(screen.getByAltText('Vivaldi')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Vivaldi App' })).toBeVisible()

  expect(screen.getAllByRole('button', { name: /[A-z]+ App/u })).toHaveLength(3)

  win.webContents.send(
    Channel.MAIN,
    receivedRendererStartupSignal({
      storage: {
        apps: [
          { id: 'org.mozilla.firefox', hotCode: null, isInstalled: true },
          { id: 'com.microsoft.edgemac', hotCode: null, isInstalled: true },
          {
            id: 'com.operasoftware.OperaGX',
            hotCode: null,
            isInstalled: false,
          },
          { id: 'com.vivaldi.Vivaldi', hotCode: null, isInstalled: true },
        ],
        supportMessage: -1,
        height: 200,
        isSetup: true,
      },
      data: {
        ...defaultData,
      },
    }),
  )

  expect(
    screen.queryByRole('alert', { name: 'Loading browsers' }),
  ).not.toBeInTheDocument()

  // Correct info sent to main when app clicked
  fireEvent.click(screen.getByRole('button', { name: 'Firefox App' }))
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.PICKER,
    addChannelToAction(
      clickedApp({
        appId: 'org.mozilla.firefox',
        isAlt: false,
        isShift: false,
      }),
      Channel.PICKER,
    ),
  )

  // Correct info sent to main when app clicked
  const url = 'http://example.com'
  win.webContents.send(Channel.MAIN, openedUrl(url))
  fireEvent.click(screen.getByRole('button', { name: 'Vivaldi App' }), {
    altKey: true,
  })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.PICKER,
    addChannelToAction(
      clickedApp({
        appId: 'com.vivaldi.Vivaldi',
        isAlt: true,
        isShift: false,
      }),
      Channel.PICKER,
    ),
  )
})

test('should show spinner when no installed apps are found', () => {
  render(<Wrapper />)
  const win = new electron.BrowserWindow()
  win.webContents.send(
    Channel.MAIN,
    receivedRendererStartupSignal({
      storage: {
        apps: [
          { id: 'com.microsoft.edgemac', hotCode: 'KeyS', isInstalled: false },
        ],
        supportMessage: -1,
        height: 200,
        isSetup: true,
      },
      data: defaultData,
    }),
  )
  expect(screen.getByRole('alert', { name: 'Loading browsers' })).toBeVisible()
})

test('should use hotkey', () => {
  render(<Wrapper />)
  const win = new electron.BrowserWindow()
  win.webContents.send(
    Channel.MAIN,
    retrievedInstalledApps(['com.microsoft.edgemac']),
  )
  win.webContents.send(
    Channel.MAIN,
    receivedRendererStartupSignal({
      storage: {
        apps: [
          { id: 'com.microsoft.edgemac', hotCode: 'KeyS', isInstalled: true },
        ],
        supportMessage: -1,
        height: 200,
        isSetup: true,
      },
      data: defaultData,
    }),
  )

  const url = 'http://example.com'
  win.webContents.send(Channel.MAIN, openedUrl(url))
  fireEvent.keyDown(document, { key: 'S', code: 'KeyS', keyCode: 83 })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.PICKER,
    addChannelToAction(
      pressedKey({
        virtualKey: 's',
        physicalKey: 'KeyS',
        altKey: false,
        shiftKey: false,
        metaKey: false,
      }),
      Channel.PICKER,
    ),
  )
})

test('should use hotkey with alt', () => {
  render(<Wrapper />)
  const win = new electron.BrowserWindow()
  win.webContents.send(
    Channel.MAIN,
    retrievedInstalledApps(['com.microsoft.edgemac']),
  )

  win.webContents.send(
    Channel.MAIN,
    receivedRendererStartupSignal({
      storage: {
        apps: [
          { id: 'com.microsoft.edgemac', hotCode: 'KeyS', isInstalled: true },
        ],
        supportMessage: -1,
        height: 200,
        isSetup: true,
      },
      data: defaultData,
    }),
  )

  const url = 'http://example.com'
  win.webContents.send(Channel.MAIN, openedUrl(url))
  fireEvent.keyDown(document, {
    key: 's',
    code: 'KeyS',
    keyCode: 83,
    altKey: true,
  })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.PICKER,
    addChannelToAction(
      pressedKey({
        virtualKey: 's',
        physicalKey: 'KeyS',
        altKey: true,
        shiftKey: false,
        metaKey: false,
      }),
      Channel.PICKER,
    ),
  )
})

test('should hold shift', () => {
  render(<Wrapper />)
  const win = new electron.BrowserWindow()
  win.webContents.send(
    Channel.MAIN,
    retrievedInstalledApps(['org.mozilla.firefox']),
  )
  win.webContents.send(Channel.MAIN, openedUrl('http://example.com'))
  fireEvent.click(screen.getByRole('button', { name: 'Firefox App' }), {
    shiftKey: true,
  })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.PICKER,
    addChannelToAction(
      clickedApp({
        appId: 'org.mozilla.firefox',
        isAlt: false,
        isShift: true,
      }),
      Channel.PICKER,
    ),
  )
})

test('should order tiles', () => {
  render(<Wrapper />)

  const win = new electron.BrowserWindow()

  win.webContents.send(
    Channel.MAIN,
    receivedRendererStartupSignal({
      storage: {
        apps: [],
        supportMessage: -1,
        height: 200,
        isSetup: true,
      },
      data: defaultData,
    }),
  )

  win.webContents.send(
    Channel.MAIN,
    retrievedInstalledApps([
      'org.mozilla.firefox',
      'com.operasoftware.OperaGX',
      'com.microsoft.edgemac',
      'com.vivaldi.Vivaldi',
    ]),
  )
  // Check tiles and tile logos shown
  const apps = screen.getAllByRole('button', { name: /[A-z]+ App/u })

  expect(apps).toHaveLength(4)

  win.webContents.send(
    Channel.MAIN,
    reorderedApp({
      sourceId: 'com.microsoft.edgemac',
      destinationId: 'org.mozilla.firefox',
    }),
  )
  win.webContents.send(
    Channel.MAIN,
    reorderedApp({
      sourceId: 'com.operasoftware.OperaGX',
      destinationId: 'org.mozilla.firefox',
    }),
  )
  win.webContents.send(
    Channel.MAIN,
    reorderedApp({
      sourceId: 'com.vivaldi.Vivaldi',
      destinationId: 'org.mozilla.firefox',
    }),
  )

  const updatedApps = screen.getAllByRole('button', { name: /[A-z]+ App/u })

  expect(updatedApps[0]).toHaveAttribute('aria-label', 'Edge App')
  expect(updatedApps[1]).toHaveAttribute('aria-label', 'Opera GX App')
  expect(updatedApps[2]).toHaveAttribute('aria-label', 'Vivaldi App')
  expect(updatedApps[3]).toHaveAttribute('aria-label', 'Firefox App')
})
