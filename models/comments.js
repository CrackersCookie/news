const connection = require("../db/connection");

const updatecommentByID = ({ comment_id }, body) => {
  if (!body.inc_votes) return Promise.reject({ status: 400, msg: "Bad Request - inc_votes missing from request body" });
  else if (Object.keys(body).length > 1) return Promise.reject({ status: 400, msg: "Bad Request - must only contain inc_votes values" });
  const votes = body.inc_votes;
  return connection
    .from("comments")
    .where({ comment_id })
    .increment({ votes })
    .returning("*")
    .then(article => {
      if (!article.length) return Promise.reject({ status: 404, msg: "Article Not Found" });
      else return article[0];
    });
}

module.exports = { updatecommentByID }