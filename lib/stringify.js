var stringifyDefinition = function (definition, isChild) {
  var result = ''

  // calls
  for (var j = 0; j < definition.calls.length; j++) {
    var call = definition.calls[j]
    if (j > 0 || isChild) result += '.'
    var param = ''
    if (call.param != undefined) param = call.param
    result += call.type + '(' + param + ')'
  }

  result += '{'

  // fields
  for (field in definition.fields) {
    var fieldValue = definition.fields[field]

    if (fieldValue === true) {
      // simple field
      result += field + ','
    } else {
      // sub object
      result += field + stringifyDefinition(fieldValue, true) + ','
    }
  }

  result += '}'

  return result
}

module.exports = function (data) {
  var result = ''

  // loop through definitions
  for (var i = 0; i < data.length; i++) {
    var definition = data[i]

    result += stringifyDefinition(definition, false)
  }

  return result
}
