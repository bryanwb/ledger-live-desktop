// @flow
import network from 'api/network'

import { GET_CATEGORIES } from 'helpers/urls'

export default async () => {
  try {
    const { data } = await network({ method: 'GET', url: GET_CATEGORIES })
    return data.length > 0 ? data : []
  } catch (err) {
    const error = Error(err.message)
    error.stack = err.stack
    throw err
  }
}
