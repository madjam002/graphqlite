var parse = require('./parser').parse
var stringify = require('./stringify')

module.exports = function (queryParts, subQueries) {
  var subQueryStrings = subQueries.map(function (subQuery) {
    var parsed = parse(subQuery)

    if (parsed.length > 1) {
      throw new Error('Query can only return one call')
    }

    // get rid of type so it can be minified
    parsed[0].type = undefined

    var minified = stringify(parsed)
    if (minified.substring(0, 1) === '{')
      minified = minified.substring(1, minified.length - 1)

    return minified
  })

  // build final query
  var finalQuery = ''

  for (var i = 0; i < queryParts.length; i++) {
    var part = queryParts[i]
    finalQuery += part

    if (i < subQueryStrings.length)
      finalQuery += subQueryStrings[i]
  }

  return finalQuery
}
