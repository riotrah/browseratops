import clsx from 'clsx'
import React from 'react'
import { useDispatch } from 'react-redux'
import { parse } from 'uri-js'

import { CARROT_URL } from '../../../../config/CONSTANTS'
import { switchOS } from '../../../../shared/utils/platform-utils'
import { useSelector } from '../../../shared/state/hooks'
import { clickedUrlBar } from '../../state/actions'

interface Props {
  className?: string
}

const UrlBar: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch()
  const url = useSelector((state) => state.data.url)
  const parsedUrl = parse(url)

  return (
    <div
      className={clsx(
        className,
        'h-20 flex-shrink-0 w-full px-4 text-center flex items-center',
        'bg-black bg-opacity-5 dark:bg-opacity-30 border-t border-gray-400 dark:border-black',
        'cursor-default',
      )}
      onClick={() => dispatch(clickedUrlBar())}
      onKeyDown={() => false}
      role="button"
      tabIndex={-1}
      title={`Click to copy (${switchOS({ mac: '⌘', windows: 'CTRL' })} + C)`}
    >
      <div
        className={clsx(
          'rounded-xl',
          'w-min',
          'py-3',
          'flex-grow tracking-wider text-opacity-50 dark:text-opacity-50 text-black dark:text-white',
          'hover:bg-black hover:bg-opacity-10 border-0',
          'focus:outline-none',
          'focus:bg-white dark:focus:bg-black focus:bg-opacity-50 dark:focus:bg-opacity-30',
          'focus:shadow-xl',
          'focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500',
          'focus:hover:ring-black dark:focus:hover:ring-white',
        )}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          overflowWrap: 'break-word',
          wordBreak: 'break-all',
          textOverflow: 'ellipsis',
        }}
      >
        {url === CARROT_URL && (
          <div>
            <span aria-label="Coffee emoji" role="img">
              ☕️
            </span>{' '}
            Choose a browser to open URL:
          </div>
        )}
        <span>{parsedUrl.scheme && `${parsedUrl.scheme}://`}</span>
        <span className="text-opacity-100 dark:text-opacity-100 text-black dark:text-white">
          {parsedUrl.host || <span className="opacity-30">Browseratops</span>}
        </span>
        <span>
          {parsedUrl.port && `:${parsedUrl.port}`}
          {parsedUrl.path}
          {parsedUrl.query && `?${parsedUrl.query}`}
          {parsedUrl.fragment && `#${parsedUrl.fragment}`}
        </span>
      </div>
    </div>
  )
}

export default UrlBar
