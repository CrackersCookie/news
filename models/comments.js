const connection = require("../db/connection");
const { selectarticleByID } = require('./articles')

const insertCommentByArticleID = ({ article_id }, reqBody) => {
  const { username, body } = reqBody;
  if (!reqBody)
    return Promise.reject({ status: 400, msg: "Bad Request - username and body required" });
  else if (Object.keys(reqBody).length > 2) return Promise.reject({ status: 400, msg: "Bad Request - Invalid key supplied" });
  else {
    const author = username;
    return connection
      .insert({ author, body, article_id })
      .into("comments")
      .returning("*")
      .then(comment => comment[0]);
  }
};

const selectCommentsByArticleID = ({ article_id }, { sort_by, order = "desc", limit = 10, p }) => {
  if (!Number(limit) || limit < 0) return Promise.reject({ status: 400, msg: "Limit must be a positive number" })
  if (p && !Number(p) || p && p < 0) return Promise.reject({ status: 400, msg: "p must be a positive number" })
  if (order === "asc" || order === "desc") {
    return connection
      .select("comment_id", "votes", "created_at", "author", "body")
      .from("comments")
      .where({ article_id })
      .orderBy(sort_by || "created_at", order)
      .modify(query => {
        if (limit) query.limit(limit);
        if (p) query.offset((p * limit) - limit);
      })
      .then(comments => {
        let commentsPresent = true;
        if (!comments.length) commentsPresent = selectarticleByID(article_id)
        return Promise.all([comments, commentsPresent])
      })
      .then(([comments, commentsPresent]) => {
        if (commentsPresent) return comments;
        else return Promise.reject({ status: 404, msg: "Article Not Found" });
      })
  } else return Promise.reject({ status: 400, msg: "Invalid sort order" })
};

const updatecommentByID = ({ comment_id }, body) => {
  let { inc_votes } = body
  if (!inc_votes) inc_votes = 0;
  if (Object.keys(body).length > 1)
    return Promise.reject({ status: 400, msg: "Bad Request - must only contain inc_votes values" });

  const votes = inc_votes;
  return connection
    .increment({ votes })
    .from("comments")
    .where({ comment_id })
    .returning("*")
    .then(article => {
      if (!article.length) return Promise.reject({ status: 404, msg: "Article Not Found" });
      else return article[0];
    });
};

const deletecommentByID = ({ comment_id }) => {
  return connection("comments")
    .where({ comment_id })
    .delete()
    .then(deletedRows => {
      if (!deletedRows) return Promise.reject({ status: 404, msg: "Comment Not Found" });
      return deletedRows;
    });
};

module.exports = { updatecommentByID, deletecommentByID, insertCommentByArticleID, selectCommentsByArticleID };
