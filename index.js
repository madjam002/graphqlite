var parser = require('./lib/parser')
var stringify = require('./lib/stringify')

exports.parse = function (ql) {
  return parser.parse(ql)
}

exports.stringify = function (data) {
  return stringify(data);
}
