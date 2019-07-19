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

const selectArticles = ({ sort_by = "created_at", order = "desc", author, topic, limit = 10, p }) => {
  if (!Number(limit) || limit < 0) return Promise.reject({ status: 400, msg: "Limit must be a positive number" })
  if (p && !Number(p) || p && p < 0) return Promise.reject({ status: 400, msg: "p must be a positive number" })
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
        if (limit) query.limit(limit);
        if (p) query.offset((p * limit) - limit);
      })
      .then(articles => {
        let waitPromise; //by passing this to the Promise.all it will wait for a response before proceeding
        if (!articles.length) {
          if (author) waitPromise = selectUserByID(author)
          if (topic) waitPromise = selectTopic(topic)
        }
        return Promise.all([articles, waitPromise]);
      }).then(([articles]) => {
        const total_count = selectArticleCount(author, topic);
        return Promise.all([articles, total_count]);
      })
      .then(([articles, total_count]) => {
        return [articles, total_count];
      })
  } else return Promise.reject({ status: 400, msg: "Invalid sort order" });
};

const selectArticleCount = (author, topic) => {
  return connection
    .select('article_id')
    .from('articles')
    .modify(query => {
      if (author) query.where({ author });
      if (topic) query.where({ topic });
    })
    .then((allArticles) => {
      return allArticles.length;
    })
}

const selectUserByID = (author) => {
  return connection
    .select('username')
    .from('users')
    .where({ "username": author })
    .then((user) => {
      if (!user.length) return Promise.reject({ status: 404, msg: "User Not Found" });
      else return true;
    })
}

const selectTopic = (topic) => {
  return connection
    .select('slug')
    .from('topics')
    .where({ "slug": topic })
    .then((topic) => {
      if (!topic.length) return Promise.reject({ status: 404, msg: "Topic Not Found" });
      else return true;
    })
}

const selectarticleByID = (article_id) => {
  return connection
    .select('article_id')
    .from('articles')
    .where({ article_id })
    .then((article) => {
      if (!article.length) return false;
      else return true;
    })
}

const insertArticle = (postBody) => {
  return connection
    .insert(postBody)
    .into("articles")
    .returning("*")
    .then(article => article[0]);
}

module.exports = {
  selectArticleByID,
  updateArticleVotesByID,
  selectArticles,
  selectarticleByID,
  insertArticle
};
