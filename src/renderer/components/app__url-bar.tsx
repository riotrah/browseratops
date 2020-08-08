import clsx from 'clsx'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import Url from 'url'

import { SPONSOR_URL } from '../../config/CONSTANTS'
import { copyUrl } from '../sendToMain'
import { useSelector } from '../store'
import { clickedUrlBackspaceButton } from '../store/actions'
import { NewLightButton } from './atoms/button'
import Kbd from './atoms/kbd'

interface Props {
  className?: string
}

const UrlBar: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch()
  const url = useSelector((state) => state.ui.url)

  const parsedUrl = url ? Url.parse(url) : undefined

  const handleCopyClick = useCallback(() => {
    copyUrl(url)
  }, [url])

  const isSponsorUrl = url === SPONSOR_URL

  const handleBackspaceButtonClick = useCallback(() => {
    dispatch(clickedUrlBackspaceButton())
  }, [dispatch])

  return (
    <div
      className={clsx(
        className,
        'flex-shrink-0',
        'flex items-center space-x-2',
        'bg-grey-800',
        'border-2 rounded-md',
        'px-2',
        'h-12',
        isSponsorUrl ? 'border-pink-500' : 'border-grey-800 ',
      )}
    >
      <div
        className={clsx(
          'flex-grow',
          isSponsorUrl ? 'text-pink-200' : 'text-grey-400 ',
          'text-xs tracking-wider font-bold',
          'flex items-center justify-between',
          'overflow-hidden',
        )}
      >
        {parsedUrl ? (
          <div className="truncate">
            <span>{parsedUrl.protocol}</span>
            {parsedUrl.slashes && '//'}
            <span
              className={clsx(
                'text-base',
                isSponsorUrl ? 'text-pink-400' : 'text-grey-200',
              )}
            >
              {parsedUrl.host}
            </span>
            <span>
              {parsedUrl.pathname}
              {parsedUrl.search}
              {parsedUrl.hash}
            </span>
          </div>
        ) : (
          <span className="text-grey-500">
            Most recently clicked link will show here
          </span>
        )}
      </div>

      <NewLightButton
        disabled={!parsedUrl}
        onClick={handleBackspaceButtonClick}
      >
        ⌫
      </NewLightButton>

      <NewLightButton
        className="space-x-1"
        disabled={!parsedUrl}
        onClick={handleCopyClick}
      >
        <span>Copy</span>
        <Kbd className="text-xxs">⌘+C</Kbd>
      </NewLightButton>
    </div>
  )
}

export default UrlBar
