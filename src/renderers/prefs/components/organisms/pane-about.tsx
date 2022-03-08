import React from 'react'
import { useDispatch } from 'react-redux'

import icon from '../../../../shared/static/icon/icon.png'
import Button from '../../../shared/components/atoms/button'
import { openURL } from '../../../shared/state/actions'
import { useSelector } from '../../../shared/state/hooks'
import {
  clickedHomepageButton,
  clickedOpenIssueButton,
} from '../../state/actions'
import { Pane } from '../molecules/pane'

export const AboutPane = (): JSX.Element => {
  const dispatch = useDispatch()
  const version = useSelector((state) => state.data.version)

  return (
    <Pane className="space-y-8" pane="about">
      <div className="text-center">
        <img alt="Logo" className="inline-block w-40" src={icon} />
        <h1 className="text-4xl tracking-wider mb-2 text-gray-900 dark:text-gray-50">
          Browseratops
        </h1>
        <p className="text-xl mb-8">The browser prompter for Windows</p>
        <p className="mb-4 opacity-70">Version {version}</p>
        <p className="mb-8">Copyright © Rayat Rahman</p>
        <div className="space-x-4">
          <Button onClick={() => dispatch(clickedHomepageButton())}>
            Homepage
          </Button>
          <Button onClick={() => dispatch(clickedOpenIssueButton())}>
            Report an Issue
          </Button>
        </div>
        <button
          className="mt-4 opacity-70"
          onClick={() => dispatch(openURL('https://icons8.com'))}
          type="button"
        >
          Icons taken graciously from icons8
        </button>
      </div>
    </Pane>
  )
}
