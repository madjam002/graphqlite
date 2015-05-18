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
  / number
  / string
  / name // for backwards compatibility of strings without using quotes
  / undefined

nameOrUndf = name
  / undefined

undefined = "" { return undefined; }
false = "false" { return false; }
null  = "null"  { return null;  }
true  = "true"  { return true;  }

// Numbers
number "number"
  = minus? int frac? exp? { return parseFloat(text()); }

decimal_point = "."
digit1_9      = [1-9]
e             = [eE]
exp           = e (minus / plus)? DIGIT+
frac          = decimal_point DIGIT+
int           = zero / (digit1_9 DIGIT*)
minus         = "-"
plus          = "+"
zero          = "0"

// Strings

name "name"
  = chars:nameChar+ {
  var str = chars.join("");
  var num = parseInt(str);
  if (!isNaN(num) && num.toString() === str) return num;
  else return str;
}

nameChar = [0-9a-zA-Z/_-]

string "string"
  = quotation_mark chars:char* quotation_mark { return chars.join(""); }

char
  = unescaped
  / escape
    sequence:(
        '"'
      / "\\"
      / "/"
      / "b" { return "\b"; }
      / "f" { return "\f"; }
      / "n" { return "\n"; }
      / "r" { return "\r"; }
      / "t" { return "\t"; }
      / "u" digits:$(HEXDIG HEXDIG HEXDIG HEXDIG) {
          return String.fromCharCode(parseInt(digits, 16));
        }
    )
    { return sequence; }

escape         = "\\"
quotation_mark = '"'
unescaped      = [\x20-\x21\x23-\x5B\x5D-\u10FFFF]

/* ----- Core ABNF Rules ----- */

/* See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4627). */
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i

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
  = name:name ws value:childDefinitionOrCall {
      return { name: name, value: value };
    }
  / name:nameOrUndf {
      return { name: name };
    }

// Definitions

definition "definition"
  = type:nameOrUndf
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
  = name:name paramNameSeparator value:value {
      return { name: name, value: value };
    }

call
  = ws type:name ws "(" params:params ")" members:object {
      return { type: type, params: params || {}, fields: members }
    }

childCall
  = ws "(" params:params ")" members:object {
      return { params: params || {}, fields: members }
    }

// Query Params

queryParam = "<" name:name ">" {
  return { type: "queryParam", name: name }
}

definitionOrCall = definition / call
childDefinitionOrCall = childDefinition / childCall
