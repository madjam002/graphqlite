var parseDefinition = function (definition, params) {
  // params
  if (definition.params) {
    for (var paramName in definition.params) {
      var paramValue = definition.params[paramName]

      if (paramValue.type === 'queryParam') {
        definition.params[paramName] = params[paramValue.name]
      }
    }
  }

  // recurse through sub definitions
  for (field in definition.fields) {
    var fieldValue = definition.fields[field]

    if (fieldValue !== true) {
      // sub definition
      parseDefinition(fieldValue, params)
    }
  }
}

module.exports = function (data, params) {
  // loop through definitions
  for (var i = 0; i < data.length; i++) {
    parseDefinition(data[i], params)
  }

  return data
}
