jest.autoMockOff()

describe('parser', function () {
  it('should parse graphql input', function () {
    var graphqlite = require('../')
    var output

    output = graphqlite.parse(`
      node(abc123).test() {
        id,
        name,
        birthdate {
          month,
          day,
        },
        birthdate {
          day,
          year
        },
        birthdate {
          month
        },
        friends.first(1) {
          cursor,
          node {
            name
          }
        }
      }

      list() {
        id,
        title
      }

      {
        foo,
        bar
      }
    `)

    expected = [
      {
        calls: [{ type: 'node', param: 'abc123' }, { type: 'test' }],
        fields: {
          id: true,
          name: true,
          birthdate: {
            calls: [],
            fields: {
              month: true,
              day: true,
              year: true
            }
          },
          friends: {
            calls: [ { type: 'first', param: 1 }],
            fields: {
              cursor: true,
              node: {
                calls: [],
                fields: {
                  name: true
                }
              }
            }
          }
        }
      },
      {
        calls: [{ type: 'list' }],
        fields: {
          id: true,
          title: true
        }
      },
      {
        calls: [],
        fields: {
          foo: true,
          bar: true
        }
      }
    ]

    expect(output).toEqual(expected)

    var queryString = graphqlite.stringify(expected)
    var queryStringPretty = graphqlite.stringify(expected, true)
    var output2 = graphqlite.parse(queryString)
    var output3 = graphqlite.parse(queryStringPretty)

    expect(output2).toEqual(expected)
    expect(output3).toEqual(expected)
  })
})
