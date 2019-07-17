const connection = require("../db/connection");

const selectArticleByID = ({ article_id }) => {
  return connection
    .select("articles.*")
    .from("articles")
    .count("comment_id AS comment_count")
    .where("articles.article_id", article_id)
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then(articleData => {
      if (!articleData.length) return Promise.reject({ status: 404, msg: "Article Not Found" });
      else return articleData[0];
    });
};

const updateArticleVotesByID = ({ article_id }, body) => {
  if (!body.inc_votes) return Promise.reject({ status: 400, msg: "Bad Request - inc_votes missing from request body" });
  else if (Object.keys(body).length > 1)
    return Promise.reject({ status: 400, msg: "Bad Request - must only contain inc_votes values" });
  else {
    const votes = body.inc_votes;
    return connection
      .increment({ votes })
      .from("articles")
      .where({ article_id })
      .returning("*")
      .then(article => {
        if (!article.length) return Promise.reject({ status: 404, msg: "Article Not Found" });
        else return article[0];
      });
  }
};

const insertCommentByArticleID = ({ article_id }, reqBody) => {
  const { username, body } = reqBody;
  if (!body || !body.length || !username)
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

const selectArticles = ({ sort_by = "created_at", order = "desc", author, topic }) => {
  if (order === "asc" || order === "desc") {
    return connection
      .select("articles.author", "title", "articles.article_id", "topic", "articles.created_at", "articles.votes")
      .count("comments.comment_id AS comment_count")
      .from("articles")
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .groupBy("articles.article_id")
      .orderBy(sort_by, order)
      .modify(query => {
        if (author) query.where({ "articles.author": author });
        if (topic) query.where({ topic });
      })
      .then(articles => {
        if (!articles.length) return Promise.reject({ status: 404, msg: "Not Found" });
        else return articles;
      });
  } else return Promise.reject({ status: 400, msg: "Invalid sort order" });
};

module.exports = {
  selectArticleByID,
  updateArticleVotesByID,
  insertCommentByArticleID,
  selectCommentsByArticleID,
  selectArticles
};
