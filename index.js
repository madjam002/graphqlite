var parser = require('./lib/parser')
var stringify = require('./lib/stringify')

exports.parse = function (ql) {
  return parser.parse(ql)
}

exports.stringify = function (data, pretty) {
  return stringify(data, pretty)
}

exports.injectParams = require('./lib/inject-params')
