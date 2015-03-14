jest.autoMockOff()

describe('parser', function () {
  it('should parse graphql input', function () {
    var graphqlite = require('../')
    var output

    output = graphqlite.parse(`
      node(abc123) {
        id,
        name,
        birthdate {
          month,
          day,
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

    expect(output).toEqual([
      {
        calls: [{ type: 'node', param: 'abc123' }],
        fields: {
          id: true,
          name: true,
          birthdate: {
            calls: [],
            fields: {
              month: true,
              day: true
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
    ])
  })
})
