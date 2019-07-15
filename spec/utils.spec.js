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
    const date = new Date(1542284514171);
    const result = formatDates(list);
    expect((result[0].created_at)).to.eql(date);
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
});

describe('makeRefObj', () => { });

describe('formatComments', () => { });
