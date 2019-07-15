process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const request = require('supertest');
const connection = require('../db/connection.js')
const app = require('../app.js')

describe('API testing', () => {
  after(() => {
    connection.destroy();
  });
  describe('GET/api/topics', () => {
    it('returns a status 200 and an object which should have a key of "topics" and the data in an array', () => {
      return request(app).get('/api/topics').expect(200).then(({ body }) => {
        expect(body.message).to.have.keys(
          'slug',
          'description'
        )
      })
    })
  })
})