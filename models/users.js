const connection = require('../db/connection')

const selectUserByID = ({ username }) => {
  return connection
    .select('*')
    .from('users')
    .first()
    .where({ username }).then((user) => {
      if (!user) return Promise.reject({ status: 404, msg: 'User Not Found' });
      else return user;
    })
}

module.exports = { selectUserByID }