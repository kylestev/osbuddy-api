const { DateTime } = require('luxon')
const debug = require('debug')('osbuddy-api:transformers:ge')

function transformGEGraphEntry(entry) {
  const newData = {
    timestamp: DateTime.fromMillis(entry.ts),
    volume: {
      buying: entry.buyingCompleted,
      overall: entry.overallCompleted,
      selling: entry.sellingCompleted
    },
    price: {
      buying: entry.buyingPrice,
      overall: entry.overallPrice,
      selling: entry.sellingPrice
    }
  }

  return newData
}

module.exports = {
  transformGEGraphEntry
}