// @flow

import uuid from 'uuid/v4'
import logger from 'logger'
import invariant from 'invariant'
import user from 'helpers/user'
import { langAndRegionSelector } from 'reducers/settings'
import { getSystemLocale } from 'helpers/systemLocale'
import { load } from './inject-in-window'

invariant(typeof window !== 'undefined', 'analytics/segment must be called on renderer thread')

const sessionId = uuid()

const getContext = store => {
  const state = store.getState()
  const { language, region } = langAndRegionSelector(state)
  const systemLocale = getSystemLocale()
  return {
    ip: '0.0.0.0',
    appVersion: __APP_VERSION__,
    language,
    region,
    environment: __DEV__ ? 'development' : 'production',
    systemLanguage: systemLocale.language,
    systemRegion: systemLocale.region,
    sessionId,
  }
}

let storeInstance // is the redux store. it's also used as a flag to know if analytics is on or off.

export const start = (store: *) => {
  const { id } = user()
  logger.analyticsStart(id)
  storeInstance = store
  const { analytics } = window
  if (typeof analytics === 'undefined') {
    logger.error('analytics is not available')
    return
  }
  load()
  analytics.identify(
    id,
    {},
    {
      context: getContext(store),
    },
  )
}

export const stop = () => {
  logger.analyticsStop()
  storeInstance = null
  const { analytics } = window
  if (typeof analytics === 'undefined') {
    logger.error('analytics is not available')
    return
  }
  analytics.reset()
}

export const track = (event: string, properties: ?Object) => {
  logger.analyticsTrack(event, properties)
  if (!storeInstance) {
    return
  }
  const { analytics } = window
  if (typeof analytics === 'undefined') {
    logger.error('analytics is not available')
    return
  }
  analytics.track(event, properties, {
    context: getContext(storeInstance),
  })
}

export const page = (category: string, name: ?string, properties: ?Object) => {
  logger.analyticsPage(category, name, properties)
  if (!storeInstance) {
    return
  }
  const { analytics } = window
  if (typeof analytics === 'undefined') {
    logger.error('analytics is not available')
    return
  }
  analytics.page(category, name, properties, {
    context: getContext(storeInstance),
  })
}
