import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useKeyboardEvents } from '../../picker/components/hooks/use-keyboard-events'
import { startedPrefs } from '../state/actions'
import { HeaderBar } from './organisms/header-bar'
import { AboutPane } from './organisms/pane-about'
import { AppsPane } from './organisms/pane-apps'
import { GeneralPane } from './organisms/pane-general'

const useAppStarted = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(startedPrefs())
  }, [dispatch])
}

const Layout = (): JSX.Element => {
  /**
   * Tell main that renderer is available
   */
  useAppStarted()

  /**
   * Setup keyboard listeners
   */
  useKeyboardEvents()

  return (
    <div className="flex flex-col h-screen w-screen text-gray-800 dark:text-gray-300 dark:bg-slate-800">
      <HeaderBar className="flex-shrink-0" />
      <div className="flex-grow overflow-hidden p-8 flex flex-col">
        <GeneralPane />
        <AppsPane />
        <AboutPane />
      </div>
    </div>
  )
}

export default Layout
