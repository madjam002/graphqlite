var compose = require('./lib/compose')

module.exports = function () {
  return compose(arguments[0], Array.prototype.slice.call(arguments, 1))
}

module.exports.parse = require('./lib/parser').parse

module.exports.stringify = require('./lib/stringify')

module.exports.injectParams = require('./lib/inject-params')
