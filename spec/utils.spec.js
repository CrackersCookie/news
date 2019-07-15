const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('returns a new array when passed an empty array', () => {
    const list = [];
    expect(formatDates(list)).to.be.a('Array');
    expect(formatDates(list)).to.not.equal(list);
  })
  it('takes an array with one object in it, containing a single key with a unix datestamp and converts this to a JS date object', () => {
    const list = [{ created_at: 1542284514171 }];
    const result = formatDates(list);
    expect((result[0].created_at instanceof Date)).to.be.true;
  })
  it('takes an array with multiple objects in it, containing a single key with a unix datestamp and converts this to a JS date object for each', () => {
    const list = [{ created_at: 1542284514171 }, { created_at: 911564514171 }];
    const date = [{ created_at: new Date(1542284514171) }, { created_at: new Date(911564514171) }];
    const result = formatDates(list);
    expect((result)).to.eql(date);
  })
  it('takes an array of articles and returns all of the original keys with the edited date value', () => {
    const list = [{
      title: 'A',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'Delicious tin of cat food',
      created_at: 911564514171,
    },
    {
      title: 'Z',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'I was hungry.',
      created_at: 785420514171,
    }];
    const expected = [{
      title: 'A',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'Delicious tin of cat food',
      created_at: new Date(911564514171),
    },
    {
      title: 'Z',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'I was hungry.',
      created_at: new Date(785420514171),
    }];
    expect(formatDates(list)).to.eql(expected);
  })
  it('does not alter the initial data it is passed', () => {
    const list = [{
      title: 'A',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'Delicious tin of cat food',
      created_at: 911564514171,
    }];
    const baseList = [{
      title: 'A',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'Delicious tin of cat food',
      created_at: 911564514171,
    }]
    formatDates(list)
    expect(list).to.eql(baseList);
  })
});

describe('makeRefObj', () => {
  it('takes an empty array and returns an empty object', () => {
    const list = [];
    expect(makeRefObj(list)).to.eql({});
  })
  it('takes an array with one item and return a key value pair - the title as the key and the article_id as the value', () => {
    const list = [{
      article_id: 34,
      title: 'Formula For Success'
    }]
    const expected = { 'Formula For Success': 34 };
    expect(makeRefObj(list)).to.eql(expected);
  });
  it('takes an array with multiple items and returns the correct key value pairs for each', () => {
    const list = [{
      article_id: 34,
      title: 'Formula For Success'
    }, {
      article_id: 33,
      title: 'The special days'
    }];
    const expected = { 'Formula For Success': 34, 'The special days': 33 };
    expect(makeRefObj(list)).to.eql(expected);
  })
  it('Does not alter the original array passed into it', () => {
    const list = [{
      article_id: 34,
      title: 'Formula For Success'
    }];
    const baseList = [{
      article_id: 34,
      title: 'Formula For Success'
    }];
    makeRefObj(list)
    expect(list).to.eql(baseList);
  })
});

describe('formatComments', () => {
  it('takes an empty array and returns a new array', () => {
    const comments = [];
    const articleRef = {}
    const result = formatComments(comments, articleRef)
    expect(result).to.eql([])
    expect(result).to.not.equal(comments)
  })
  it('takes an array with one comment object and changes the "created_by" key to "author"', () => {
    const comments = [{ created_by: 'icellusedkars' }];
    const articleRef = {};
    const result = formatComments(comments, articleRef);
    expect(result[0].author).to.equal('icellusedkars');
  })
  it('takes an array with one comment object and changes the "belongs_to" key to "article_id" and changes the value using the articleRef', () => {
    const comments = [{ belongs_to: 'Formula For Success' }];
    const articleRef = { 'Formula For Success': 34 };
    const expected = [{ article_id: 34 }]
    const result = formatComments(comments, articleRef);
    expect(result[0].article_id).to.equal(34);
  })
  it('takes an array with one comment object and changes the "created_at" value into a JS date object', () => {
    const comments = [{ created_at: 1322138163389 }];
    const articleRef = {};
    const result = formatComments(comments, articleRef);
    expect(result[0].created_at).to.eql(new Date(1322138163389));
  })
  it('takes an array with a full comment object and returns an object in an array with all the correct values', () => {
    const comments = [{
      body: 'Delicious crackerbreads',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'icellusedkars',
      votes: 0,
      created_at: 1290602163389,
    }];
    const articleRef = { 'Living in the shadow of a great man': 12 };
    const expected = [{
      body: 'Delicious crackerbreads',
      article_id: 12,
      author: 'icellusedkars',
      votes: 0,
      created_at: new Date(1290602163389),
    }];
    const result = formatComments(comments, articleRef);
    expect(result).to.eql(expected);
  })
  it('takes an array with multiple items and returns the correct result', () => {
    const comments = [{
      body: 'Delicious crackerbreads',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'icellusedkars',
      votes: 0,
      created_at: 1290602163389,
    }, {
      body: 'Delicious crackerbreads',
      belongs_to: 'Peaceful living',
      created_by: 'icellusedkars',
      votes: 0,
      created_at: 1290602163535,
    }];
    const articleRef = { 'Living in the shadow of a great man': 12, 'Peaceful living': 11 };
    const expected = [{
      body: 'Delicious crackerbreads',
      article_id: 12,
      author: 'icellusedkars',
      votes: 0,
      created_at: new Date(1290602163389),
    }, {
      body: 'Delicious crackerbreads',
      article_id: 11,
      author: 'icellusedkars',
      votes: 0,
      created_at: new Date(1290602163535),
    }];
    const result = formatComments(comments, articleRef);
    expect(result).to.eql(expected);
  })
  it('does not mutate the original array passed in', () => {
    const comments = [{
      body: 'Delicious crackerbreads',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'icellusedkars',
      votes: 0,
      created_at: 1290602163389,
    }];
    const articleRef = { 'Living in the shadow of a great man': 12 };
    const baseComments = [{
      body: 'Delicious crackerbreads',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'icellusedkars',
      votes: 0,
      created_at: 1290602163389,
    }];
    formatComments(comments, articleRef);
    expect(comments).to.eql(baseComments);
  })
});
