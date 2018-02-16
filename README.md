[![npm version](https://badge.fury.io/js/osbuddy-api.svg)](https://npmjs.com/package/osbuddy-api)

# osbuddy-api

Unofficial OSBuddy API client. This does not support or document all of the
available endpoints.

## Install

`$ npm i osbuddy-api`

## Example Usage

```javascript
// example.js
const { getHourlyPrices, Statistics } = require('osbuddy-api')

const stats = new Statistics()

// fetch the online user stats
stats.onlineUsers().then(stats => {
  console.log('online user statistics:', stats)
})

// get "Santa hat" prices
getHourlyPrices(1050)
  .then(({ itemId, interval, records }) => {
    console.log(`${records.length} prices for ${itemId}`)

    records.forEach(({ timestamp, price, volume }) => {
      // price and volume have "buying", "selling", and "overall" fields
      console.log(`${new Date(timestamp)} - price: ${price.overall} (total: ${volume.overall})`)
    })
  })
```
