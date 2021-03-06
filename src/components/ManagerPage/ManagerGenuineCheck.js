// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import { i } from 'helpers/staticPath'

import GenuineCheck from 'components/GenuineCheck'
import Box from 'components/base/Box'
import Space from 'components/base/Space'
import Text from 'components/base/Text'
import TrackPage from 'analytics/TrackPage'

type Props = {
  t: T,
  onSuccess: void => void,
}

class ManagerGenuineCheck extends PureComponent<Props> {
  render() {
    const { t, onSuccess } = this.props
    return (
      <Box align="center">
        <TrackPage category="Manager" name="Genuine Check" />
        <Space of={60} />
        <Box align="center" style={{ maxWidth: 460 }}>
          <img
            src={i('logos/connectDevice.png')}
            alt="connect your device"
            style={{ marginBottom: 30, maxWidth: 362, width: '100%' }}
          />
          <Text ff="Museo Sans|Regular" fontSize={7} color="black" style={{ marginBottom: 10 }}>
            {t('app:manager.device.title')}
          </Text>
          <Text ff="Museo Sans|Light" fontSize={5} color="grey" align="center">
            {t('app:manager.device.desc')}
          </Text>
        </Box>
        <Space of={40} />
        <GenuineCheck shouldRenderRetry onSuccess={onSuccess} />
      </Box>
    )
  }
}

export default translate()(ManagerGenuineCheck)
