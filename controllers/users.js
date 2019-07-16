const { selectUserByID } = require('../models/users')


const sendUserByID = (req, res, next) => {
  selectUserByID(req.params).then((user) => {
    res.status(200).send({ user })
  }).catch(next)
}
module.exports = { sendUserByID }