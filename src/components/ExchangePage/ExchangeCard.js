// @flow

import React, { PureComponent } from 'react'
import { shell } from 'electron'
import { track } from 'analytics/segment'

import type { T } from 'types/common'

import ExternalLinkIcon from 'icons/ExternalLink'
import Box, { Card } from 'components/base/Box'
import { FakeLink } from 'components/base/Link'

type CardType = {
  id: string,
  logo: any,
  url: string,
}

export default class ExchangeCard extends PureComponent<{ t: T, card: CardType }> {
  onClick = () => {
    const { card } = this.props
    shell.openExternal(card.url)
    track('VisitExchange', { id: card.id, url: card.url })
  }
  render() {
    const {
      card: { logo, id },
      t,
    } = this.props
    return (
      <Card horizontal py={5} px={6} style={{ cursor: 'pointer' }} onClick={this.onClick}>
        <Box justify="center" style={{ width: 200 }}>
          {logo}
        </Box>
        <Box shrink ff="Open Sans|Regular" fontSize={4} flow={3}>
          <Box>{t(`app:exchange.${id}`)}</Box>
          <Box horizontal align="center" color="wallet" flow={1}>
            <FakeLink>{t('app:exchange.visitWebsite')}</FakeLink>
            <ExternalLinkIcon size={14} />
          </Box>
        </Box>
      </Card>
    )
  }
}
