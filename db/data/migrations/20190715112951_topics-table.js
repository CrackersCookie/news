exports.up = function(connection) {
  return connection.schema.createTable("topics", topicsTable => {
    topicsTable
      .string("slug")
      .primary()
      .notNullable();
    topicsTable.string("description").notNullable();
  });
};

exports.down = function(connection) {
  return connection.schema.dropTable("topics");
};
