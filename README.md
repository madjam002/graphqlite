GraphQLite  [![NPM](https://img.shields.io/npm/v/graphqlite.svg?style=flat)](https://npmjs.org/package/graphqlite) ![Downloads](https://img.shields.io/npm/dm/graphqlite.svg?style=flat)
=======

GraphQLite is a Javascript Parser for Facebook's GraphQL.

(see http://facebook.github.io/react/blog/2015/05/01/graphql-introduction.html)

## Installation

```sh
$ npm install graphqlite
```

## Usage

GraphQLite exposes a simple API for parsing GraphQL (example uses ES6 multi-line strings).

```javascript
var graphql = require('graphqlite')

var output = graphql.parse(`
  node(id: 123) {
    id,
    name,
    birthdate {
      month,
      day,
    },
    friends(first: 1) {
      cursor,
      edges {
        node {
          name
        }
      }
    }
  }

  filter(name: "test string parameter") {

  }
`)

var backToString = graphql.stringify(output)
var pretty = graphql.stringify(output, true)
```

In the above example, `output` will be:

```javascript
[{
  "type": "node",
  "params": {
    "id": 123
  },
  "fields": {
    "id": true,
    "name": true,
    "birthdate": {
      "fields": {
        "month": true,
        "day": true
      }
    },
    "friends": {
      "params": {
        "first": 1
      },
      "fields": {
        "cursor": true,
        "edges": {
          "fields": {
            "node": {
              "fields": {
                "name": true
              }
            }
          }
        }
      }
    }
  }
}, {
  "type": "filter",
  "params": {
    "name": "test string parameter"
  }
}]
```

`stringify` takes the output from `parse` and generates a GraphQL string. If no second parameter is provided, the output will be minified. If the second parameter is `true`, the output will be prettified.

### ES6 Templates

GraphQLite can also be used with ES6 template strings, like follows:

```javascript
var graphql = require('graphqlite')

var EventQuery = graphql`
  Event {
    name,
    location
  }
`

var UserQuery = graphql`
  User {
    name,
    profilePic
  }
`

var FinalQuery = graphql`
  Viewer {
    endpoint,
    feed(first: <first>) {
      id
    },

    ${EventQuery},
    ${UserQuery}
  }
`

```

This allows queries to be composed. `FinalQuery` in the above example will be a composed GraphQL string.

## Roadmap
Facebook will be releasing a GraphQL module in the future, but I didn't know what to expect from this
so I created this basic one as an experiment.
Therefore this module could become obsolete in the future.

## License

Licensed under the MIT License.

View the full license [here](https://raw.githubusercontent.com/madjam002/graphqlite/master/LICENSE).
