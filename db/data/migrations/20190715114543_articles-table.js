
exports.up = function (connection) {
  return connection.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id').primary().notNullable();
    articlesTable.string('title');
    articlesTable.string('body', 5000);
    articlesTable.integer('votes').defaultTo(0);
    articlesTable.string('topic').references('topics.slug');
    articlesTable.string('author').references('users.username');
    articlesTable.timestamp('created_at').defaultTo(connection.fn.now());
  })
};

exports.down = function (connection) {
  return connection.schema.dropTable('articles');
};
