/*
GraphQL Grammar
*/

{
  var extend = require('extend')
}

GraphQL
  = ws value:definitionOrCall* ws { return value; }

ws "whitespace" = [ \t\n\r]*

beginObject = ws "{" ws
endObject = ws "}" ws
valueSeparator = ws "," ws
callSeparator = ws "." ws
paramNameSeparator = ws ":" ws

// Values
value = false
  / true
  / null
  / queryParam
  / string
  / undefined

stringOrUndf = string
  / undefined

undefined = "" { return undefined; }
false = "false" { return false; }
null  = "null"  { return null;  }
true  = "true"  { return true;  }

// Strings

string "string"
  = chars:char+ {
  var str = chars.join("");
  var num = parseInt(str);
  if (!isNaN(num) && num.toString() === str) return num;
  else return str;
}

char = [0-9a-zA-Z/]

// Objects

object
  = beginObject
    members:(
      first:member
      rest:(valueSeparator m:member { return m; })*
      {
        var result = {}, i, newData;

        if (first.name !== undefined) {
          newData = {};
          newData[first.name] = first.value || true;
          extend(true, result, newData);
        }

        for (i = 0; i < rest.length; i++) {
          if (rest[i].name !== undefined) {
            newData = {};
            newData[rest[i].name] = rest[i].value || true;
            extend(true, result, newData);
          }
        }

        return result;
      }
    )?
    endObject
    { return members !== null ? members: {}; }

member
  = name:string ws value:childDefinitionOrCall {
      return { name: name, value: value };
    }
  / name:stringOrUndf {
      return { name: name };
    }

// Definitions

definition "definition"
  = type:stringOrUndf
    members:object {
      return { type: type, fields: members }
    }

childDefinition
  = members:object {
      return { fields: members }
    }

// Calls

params
  = (first:param
    rest:(valueSeparator m:param { return m; })*
    {
      var result = {}, i;

      result[first.name] = first.value;

      for (i = 0; i < rest.length; i++) {
        result[rest[i].name] = rest[i].value;
      }

      return result;
    })?

param
  = name:string paramNameSeparator value:value {
      return { name: name, value: value };
    }

call
  = ws type:string ws "(" params:params ")" members:object {
      return { type: type, params: params || {}, fields: members }
    }

childCall
  = ws "(" params:params ")" members:object {
      return { params: params || {}, fields: members }
    }

// Query Params

queryParam = "<" name:string ">" {
  return { type: "queryParam", name: name }
}

definitionOrCall = definition / call
childDefinitionOrCall = childDefinition / childCall
