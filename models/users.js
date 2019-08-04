const connection = require("../db/connection");

const selectUserByID = ({ username }) => {
  return connection
    .select("*")
    .from("users")
    .first()
    .where({ username })
    .then(user => {
      if (!user) return Promise.reject({ status: 404, msg: "User Not Found" });
      else return user;
    });
};

const insertUser = ({
  username, name, avatar_url = 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png' }) => {
  return connection
    .insert({ username, name, avatar_url })
    .into("users")
    .returning("*")
    .then(user => user[0]);
}

const selectUsers = () => {
  return connection.select("*").from("users");
};

module.exports = { selectUserByID, insertUser, selectUsers };
