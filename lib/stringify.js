var stringifyDefinition = function (definition, level, pretty) {
  var result = ''
  var indent = ''

  if (pretty)
    for (var l = 0; l < level; l++) {
      indent += '  '
    }

  // type
  if (definition.type)
    result += definition.type

  // params
  if (definition.params) {
    result += '('

    var j = 0
    for (var paramName in definition.params) {
      var paramValue = definition.params[paramName]
      result += paramName + ':'
      if (pretty) result += ' '

      if (paramValue.type === 'queryParam')
        result += '<' + paramValue.name + '>'
      else if (typeof paramValue === 'string')
        result += '"' + paramValue.replace(/[\\]/g, '\\\\')
                                  .replace(/[\"]/g, '\\\"')
                                  .replace(/[\/]/g, '\\/')
                                  .replace(/[\b]/g, '\\b')
                                  .replace(/[\f]/g, '\\f')
                                  .replace(/[\n]/g, '\\n')
                                  .replace(/[\r]/g, '\\r')
                                  .replace(/[\t]/g, '\\t') + '"'
      else
        result += paramValue

      if (++j < Object.keys(definition.params).length) result += ',' + (pretty ? ' ' : '')
    }

    result += ')'
  }


  if (pretty) result += ' '

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
      result += field + stringifyDefinition(fieldValue, level + 1, pretty) + ','
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

    result += stringifyDefinition(definition, 1, pretty)
  }

  return result
}
