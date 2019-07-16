const connection = require('../db/connection')

const selectArticleByID = ({ article_id }) => {
  return connection
    .select('articles.*', 'comment_id')
    .from('articles')
    .where('articles.article_id', article_id).leftJoin('comments', 'articles.article_id', 'comments.article_id').then((articleData) => {
      const { comment_id, ...restOfArticle } = articleData[0]
      const article = { ...restOfArticle }
      if (!comment_id) {
        article.comment_count = 0;
        return article;
      } else {
        article.comment_count = articleData.length;
        return article;
      }
    })
}

module.exports = { selectArticleByID }