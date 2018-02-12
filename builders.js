const querystring = require('qs')

const { DateTime, Duration, Interval } = require('luxon')

class RequestBuilder {
  constructor(moduleName) {
    this.params = {}
    this.moduleName = moduleName
  }

  action(name) {
    this.params.a = name
    return this
  }

  param(key, value) {
    this.params = {
      ...this.params,
      [key]: value
    }
    return this
  }

  toURL() {
    const qs = querystring.stringify(this.params)
    return `/${this.moduleName}?${qs}`
  }
}

class GrandExchangeBuilder extends RequestBuilder {
  constructor() {
    super('grandExchange')
  }

  gotoGraph() {
    return this.action('graph')
  }

  start(ts) {
    let time = ts
    if (ts instanceof DateTime) {
      time = ts.valueOf()
    }
    return this.param('start', time.toFixed(0))
  }

  itemId(id) {
    return this.param('i', id)
  }

  period(p) {
    // { results: 54, duration: { hours: 3 }, g: 180 }
    // { results: 32, duration: { days: 1 }, g: 1440 }
    // { results: 32, duration: { days: 3 }, g: 4320 }
    let length = p
    if (p instanceof Duration) {
      length = Math.abs(p.as('hours')) * 60
    }
    
    return this.param('g', `${length.toFixed(0)}`)
  }
}

module.exports = {
  RequestBuilder,
  GrandExchangeBuilder
}
