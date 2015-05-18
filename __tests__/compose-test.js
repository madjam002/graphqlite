jest.autoMockOff()

describe('compose', function () {
  it('should combine several queries', function () {
    var graphqlite = require('../')
    var output

    var UserQuery = graphqlite`
      User {
        name
      }
    `

    var EventQuery = graphqlite`
      Event {
        name,
        location,

        creator {
          ${UserQuery}
        }
      }
    `

    output = graphqlite`
      Viewer {
        ipAddress,

        events(first: <first>) {
          ${EventQuery}
        },

        friends(first: 10) {
          ${UserQuery}
        }
      }
    `

    expected = `
      Viewer {
        ipAddress,

        events(first: <first>) {
          name,
          location,

          creator {
            name
          }
        },

        friends(first: 10) {
          name
        }
      }
    `

    expect(graphqlite.stringify(graphqlite.parse(output)))
    .toEqual(graphqlite.stringify(graphqlite.parse(expected)))
  })
})
