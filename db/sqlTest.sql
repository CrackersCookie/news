\c nc_news_test;

SELECT articles.article_id, COUNT(comments.comment_id)
FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
GROUP BY (articles.article_id);

