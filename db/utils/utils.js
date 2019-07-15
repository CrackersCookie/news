exports.formatDates = list => {
  const formattedList = [];

  list.forEach(({ created_at, ...restOfKeys }) => {
    formattedDate = new Date(created_at);
    formattedList.push({ created_at: formattedDate, ...restOfKeys })
  })

  return formattedList;
};

exports.makeRefObj = list => { };

exports.formatComments = (comments, articleRef) => { };
