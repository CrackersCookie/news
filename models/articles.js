const connection = require('../db/connection')

const selectArticleByID = ({ article_id }) => {
  return connection
    .select('articles.*', 'comment_id')
    .from('articles')
    .where('articles.article_id', article_id).leftJoin('comments', 'articles.article_id', 'comments.article_id').then((articleData) => {
      if (!articleData.length) return Promise.reject({ status: 404, msg: 'Article Not Found' })
      else {
        const { comment_id, ...restOfArticle } = articleData[0];
        const article = { ...restOfArticle };
        if (!comment_id) {
          article.comment_count = 0;
          return article;
        } else {
          article.comment_count = articleData.length;
          return article;
        }
      }
    })
}

const updateArticleVotesByID = ({ article_id }, body) => {
  if (!body.inc_votes) return Promise.reject({ status: 400, msg: 'Bad Request - inc_votes missing from request body' })
  else if (Object.keys(body).length > 1) {
    console.log('in here')
    return Promise.reject({ status: 400, msg: 'Bad Request - must only contain inc_votes values' })
  }
  else {
    const votes = body.inc_votes
    return connection
      .from('articles')
      .where({ article_id })
      .increment({ votes })
      .returning('*').then((article) => {
        if (!article.length) return Promise.reject({ status: 404, msg: 'Article Not Found' })
        return article[0]
      })
  }
}

module.exports = { selectArticleByID, updateArticleVotesByID }