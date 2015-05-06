jest.autoMockOff()

describe('parser', function () {
  it('should parse graphql input', function () {
    var graphqlite = require('../')
    var output

    output = graphqlite.parse(`
      user(id: abc123) {
        id,
        name,
        birthdate {
          month, day
        },
        birthdate {
          day,
          year,
        },
        friends(first: 50, after: 100) {
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
        something(first: 62) {
          edges {
            node {
              id
            }
          }
        }
      }
    `)

    expected = [{
      "type": "user",
      "params": {
        "id": "abc123"
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
            "first": 50,
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
            "first": 62
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
    }]

    expect(output).toEqual(expected)

    var queryString = graphqlite.stringify(expected)
    var queryStringPretty = graphqlite.stringify(expected, true)
    var output2 = graphqlite.parse(queryString)
    var output3 = graphqlite.parse(queryStringPretty)

    expect(output2).toEqual(expected)
    expect(output3).toEqual(expected)
  })
})
