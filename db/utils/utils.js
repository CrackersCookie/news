formatDates = list => {
  const formattedList = [];

  list.forEach(({ created_at, ...restOfKeys }) => {
    formattedDate = new Date(created_at);
    formattedList.push({ created_at: formattedDate, ...restOfKeys })
  })

  return formattedList;
};

makeRefObj = list => {
  const lookUp = list.reduce((acc, cur) => {
    acc[cur.title] = cur.article_id;
    return acc
  }, {})
  return lookUp
};

formatComments = (comments, articleRef) => {
  if (!comments.length) return [];
  const formattedData = formatDates(comments)

  return formattedData.map(comment => {
    const { created_by, belongs_to, ...restOfKeys } = comment
    return {
      author: created_by,
      article_id: articleRef[belongs_to],
      ...restOfKeys
    };
  })
};

module.exports = { formatDates, makeRefObj, formatComments }
