const connection = require("../db/connection");

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

const selectCommentsByArticleID = ({ article_id }, { sort_by, order = "desc" }) => {
  if (order === "asc" || order === "desc") {
    return connection
      .select("comment_id", "votes", "created_at", "author", "body")
      .from("comments")
      .where({ article_id })
      .orderBy(sort_by || "created_at", order)
      .then(comments => {
        if (!comments.length) return Promise.reject({ status: 404, msg: "Article or Comments Not Found" });
        else return comments;
      });
  } else return Promise.reject({ status: 400, msg: "Invalid sort order" });
};

const updatecommentByID = ({ comment_id }, body) => {
  if (!body.inc_votes) return Promise.reject({ status: 400, msg: "Bad Request - inc_votes missing from request body" });
  else if (Object.keys(body).length > 1)
    return Promise.reject({ status: 400, msg: "Bad Request - must only contain inc_votes values" });

  const votes = body.inc_votes;
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
    .returning()
    .then(deletedRows => {
      if (!deletedRows) return Promise.reject({ status: 404, msg: "Comment Not Found" });
      return deletedRows;
    });
};

module.exports = { updatecommentByID, deletecommentByID, insertCommentByArticleID, selectCommentsByArticleID };
