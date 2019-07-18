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
  let { inc_votes } = body
  if (!inc_votes) inc_votes = 0;
  if (Object.keys(body).length > 1)
    return Promise.reject({ status: 400, msg: "Bad Request - must only contain inc_votes values" });
  else {
    const votes = inc_votes;
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
  selectArticles
};
