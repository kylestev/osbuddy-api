const Axios = require('axios')
const makeDebug = require('debug')
const debug = makeDebug('osbuddy-api:client')

const API_URL = process.env.ENDPOINT_URL || 'https://api.rsbuddy.com'

const OSB = Axios.create({
  baseURL: API_URL,
  timeout: 15e3,
  headers: {
    //
  }
})

const ChromeHeaders = {
  accept: '*/*',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'en-US,en;q=0.9',
  dnt: '1',
  origin: 'https://rsbuddy.com',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36'
}

function createAxios (opts) {
  const defaults = {
    baseURL: API_URL,
    timeout: 15e3,
    headers: ChromeHeaders
  }
  const client = Axios.create({ ...defaults, ...opts })
  // const reqDebugger = makeDebug('[request]')
  client.interceptors.request.use(function (req) {
    debug('[request]', req.url)
    return req
  })
  return client
}

module.exports = {
  createHttpClient: (opts = {}) => {
    return createAxios(opts)
  }
}