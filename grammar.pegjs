/*
GraphQL Grammar
*/

{
  var deepExtend = require('deep-extend')
}

GraphQL
  = ws value:definition* ws { return value; }

ws "whitespace" = [ \t\n\r]*

beginObject = ws "{" ws
endObject = ws "}" ws
valueSeparator = ws "," ws
callSeparator = ws "." ws

// Values
value = false
  / true
  / null
  / string
  / undefined

stringOrUndf = string
  / undefined

undefined = "" { return undefined; }
false = "false" { return false; }
null  = "null"  { return null;  }
true  = "true"  { return true;  }

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
          deepExtend(result, newData);
        }

        for (i = 0; i < rest.length; i++) {
          if (rest[i].name !== undefined) {
            newData = {};
            newData[rest[i].name] = rest[i].value || true;
            deepExtend(result, newData);
          }
        }

        return result;
      }
    )?
    endObject
    { return members !== null ? members: {}; }

member
  = name:string ws value:childDefinition {
      return { name: name, value: value };
    }
  / name:stringOrUndf {
      return { name: name };
    }

// Calls

call = ws type:string ws "(" param:value ")" {
  return { type: type, param: param };
}

startDefinition = calls:(
      first: call
      rest:(callSeparator c:call { return c; })*
      {
        var result = [];
        result[0] = first;
        for (var i = 0; i < rest.length; i++) {
          result[i + 1] = rest[i];
        }

        return result;
      }
    )
  / { return []; }

definition "definition"
  = calls:startDefinition
    members:object {
      return { calls: calls, fields: members }
    }

childDefinition "definition"
  = callSeparator def:definition {
    return def;
  }
  / def:object {
    return { calls: [], fields: def };
  }

// Strings

string "string"
  = chars:char+ {
  var str = chars.join("");
  var num = parseInt(str);
  if (!isNaN(num) && num.toString() === str) return num;
  else return str;
}

char = [0-9a-zA-Z]
