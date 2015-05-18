jest.autoMockOff()

describe('parser', function () {
  it('should parse graphql input', function () {
    var graphqlite = require('../')
    var output

    output = graphqlite.parse(`
      user(id: "abc123,_-@'/hi\\"test with spaces") {
        id,
        name,
        birthdate {
          month, day
        },
        birthdate {
          day,
          year,
        },
        friends(first: <first>, after: 100) {
          edges {
            node {
              name,
              id,
            }
          }
        },
        profilePicture() {
          id,
        }
      }

      Viewer {
        something(first: 62, minus: -1503423, decimal: 523.3594358, decimalAndMinus: -234234.4656456, string: <hello>) {
          edges {
            node {
              id
            }
          }
        }
      }

      test(id: backwardsCompatibility) {
        name
      }
    `)

    expected = [{
      "type": "user",
      "params": {
        "id": "abc123,_-@'/hi\"test with spaces"
      },
      "fields": {
        "id": true,
        "name": true,
        "birthdate": {
          "fields": {
            "day": true,
            "month": true,
            "year": true
          }
        },
        "friends": {
          "params": {
            "first": { "type": "queryParam", "name": "first" },
            "after": 100
          },
          "fields": {
            "edges": {
              "fields": {
                "node": {
                  "fields": {
                    "name": true,
                    "id": true
                  }
                }
              }
            }
          }
        },
        "profilePicture": {
          "params": {},
          "fields": {
            "id": true
          }
        }
      }
    }, {
      "type": "Viewer",
      "fields": {
        "something": {
          "params": {
            "first": 62,
            "minus": -1503423,
            "decimal": 523.3594358,
            "decimalAndMinus": -234234.4656456,
            "string": { "type": "queryParam", "name": "hello" }
          },
          "fields": {
            "edges": {
              "fields": {
                "node": {
                  "fields": {
                    "id": true
                  }
                }
              }
            }
          }
        }
      }
    }, {
      "type": "test",
      "params": {
        "id": "backwardsCompatibility"
      },
      "fields": {
        "name": true
      }
    }]

    expect(output).toEqual(expected)

    var queryString = graphqlite.stringify(expected)
    var queryStringPretty = graphqlite.stringify(expected, true)

    var output2 = graphqlite.parse(queryString)
    var output3 = graphqlite.parse(queryStringPretty)

    var injectedParams = graphqlite.injectParams(output, {first: 999, hello: 'foobar'})

    expect(output2).toEqual(expected)
    expect(output3).toEqual(expected)

    expected[0].fields.friends.params.first = 999
    expected[1].fields.something.params.string = 'foobar'

    expect(injectedParams).toEqual(expected)
  })
})
