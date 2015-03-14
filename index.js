var parser = require('./lib/parser')

exports.parse = function (ql) {
  return parser.parse(ql)
}
