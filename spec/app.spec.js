process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const request = require('supertest');
const connection = require('../db/connection.js')
const app = require('../app.js')

describe('API testing', () => {
  beforeEach(() => connection.seed.run())
  after(() => {
    connection.destroy();
  });
  describe('GET/api/topics', () => {
    it('returns a status 200 and an object which should have a key of "topics" and the data in an array', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body.topics[0]).to.have.keys(
            'slug',
            'description'
          )
        });
    });
    it('gives a 405 status and "Method Not Allowed" when attempting to post, patch or delete topics', () => {
      const invalidMethods = ['patch', 'put', 'delete'];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)[method]('/api/topics')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Method Not Allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe('ERROR/not-a-route', () => {
    it('gives a 404 erorr and "Route Not Found" when using a route that does not exist', () => {
      return request(app)
        .get("/api/not-a-route")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route Not Found");
        });
    });
  });
});