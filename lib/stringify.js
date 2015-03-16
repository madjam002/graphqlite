var stringifyDefinition = function (definition, isChild, level, pretty) {
  var result = ''
  var indent = ''

  if (pretty)
    for (var l = 0; l < level; l++) {
      indent += '  '
    }

  // calls
  for (var j = 0; j < definition.calls.length; j++) {
    var call = definition.calls[j]
    if (j > 0 || isChild) result += '.'
    var param = ''
    if (call.param != undefined) param = call.param
    result += call.type + '(' + param + ')'
  }

  if (pretty && (definition.calls.length > 0 || level > 1)) result += ' '

  result += '{'

  if (pretty) result += '\n'

  // fields
  var hadFields = false
  for (field in definition.fields) {
    hadFields = true
    var fieldValue = definition.fields[field]

    result += indent

    if (fieldValue === true) {
      // simple field
      result += field + ','
    } else {
      // sub object
      result += field + stringifyDefinition(fieldValue, true, level + 1, pretty) + ','
    }

    if (pretty) result += '\n'
  }

  if (hadFields) {
    result = result.substring(0, result.length - (pretty ? 2 : 1))
  }

  if (pretty) result += '\n'

  result += indent.substring(0, indent.length - 2) + '}'

  if (pretty && level === 1) result += '\n\n'

  return result
}

module.exports = function (data, pretty) {
  var result = ''

  // loop through definitions
  for (var i = 0; i < data.length; i++) {
    var definition = data[i]

    result += stringifyDefinition(definition, false, 1, pretty)
  }

  return result
}
