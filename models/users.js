const connection = require('../db/connection')

const selectUserByID = ({ username }) => {
  return connection
    .select('*').from('users').where({ username }).then((user) => {
      return user[0]
    })
}

module.exports = { selectUserByID }