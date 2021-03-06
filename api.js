const _ = require('lodash')
const { createHttpClient } = require('./client')
const { GrandExchangeBuilder } = require('./builders')
const debug = require('debug')('osbuddy-api:api')
const { transformGEGraphEntry } = require('./transformers/grandExchangeTransforms')
const { DateTime, Duration, Interval } = require('luxon')

class Statistics {
  constructor (client = null) {
    this.client = client || createHttpClient()
  }

  onlineUsers () {
    return this.client.get('stats')
      .then(({ data }) => data)
  }
}

class GrandExchange {
  constructor (client = null) {
    this.client = client || createHttpClient()
  }

  graph (configFn) {
    const geBuilder = new GrandExchangeBuilder()
    const config = configFn(
      geBuilder
        .gotoGraph()
        .period(1440)
    )
    return this.client.get(config.toURL())
      .then(({ data }) => data.map(transformGEGraphEntry))
  }
}

function getTimestampRange(captures) {
  const [start, end] = _.chain([
    captures[0], captures.reverse()[0]
  ]).map(x => x.timestamp)
    .value()

  return Interval.fromDateTimes(start, end)
}

function getHourlyPrices(itemId) {
  const ge = new GrandExchange()
  return ge.graph(graph =>
    graph
      .itemId(itemId)
      .start(DateTime.local().minus({ weeks: 50 }))
      .period(60)
  )
    .then(data => _.sortBy(data, [x => +x.timestamp]))
    .then(captures => {
      const span = getTimestampRange(captures)
      debug(span.length('hours'))
      debug(captures.length, 'num records')
      return {
        itemId,
        interval: span.toISO(),
        records: captures.map(x => Object.assign({}, x, {
          timestamp: x.timestamp.valueOf()
        }))
      }
    })
}

module.exports = {
  GrandExchange,
  Statistics,
  getHourlyPrices
}
