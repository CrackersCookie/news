const { selectUserByID, insertUser, selectUsers } = require("../models/users");

const sendUserByID = (req, res, next) => {
  selectUserByID(req.params)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

const postUser = (req, res, next) => {
  const { body } = req;
  insertUser(body)
    .then(user => {
      res.status(201).send({ user });
    }).catch(next);
};

const sendUsers = (req, res, next) => {
  selectUsers()
    .then(users => {
      res.status(200).send({ users });
    }).catch(next);
}

module.exports = { sendUserByID, postUser, sendUsers };
