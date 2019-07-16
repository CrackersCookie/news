process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);
const { expect } = chai;
const request = require("supertest");
const connection = require("../db/connection.js");
const app = require("../app.js");

describe("API testing", () => {
  beforeEach(() => connection.seed.run());
  after(() => {
    connection.destroy();
  });
  describe("GET/api/topics", () => {
    it('returns a status 200 and an object which should have a key of "topics" and the data in an array', () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics[0]).to.have.keys("slug", "description");
        });
    });
    it('ERROR - gives a 405 status and "Method Not Allowed" when attempting to post, patch or delete topics', () => {
      const invalidMethods = ["patch", "put", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method Not Allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("GET/api/users/:username", () => {
    it("returns a status 200 and the user data when a valid username is requested", () => {
      return request(app)
        .get("/api/users/icellusedkars")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).to.have.keys("username", "avatar_url", "name");
        });
    });
    it("ERROR - returns a status 404 and a message indicating the user was not found when an invalid username is requested", () => {
      return request(app)
        .get("/api/users/not-valid-user")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("User Not Found");
        });
    });
    it('ERROR - gives a 405 status and "Method Not Allowed" when attempting to post, patch or delete users by username', () => {
      const invalidMethods = ["patch", "put", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/users/5")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method Not Allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("GET /api/articles/:article_id", () => {
    it("GET returns a 200 status and article data when passed a valid artcile_id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).to.have.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
        });
    });
    it("GET returns a 200 status and article data when passed a valid artcile_id for an article with no comments", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.comment_count).to.equal(0);
        });
    });
    it('ERROR - gives a 405 status and "Method Not Allowed" when attempting to post or delete articles by article_id', () => {
      const invalidMethods = ["post", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles/34")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method Not Allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    it('ERROR / GET it returns a status 400 and a "bad Request" message when passed an article_id in the wrong format', () => {
      return request(app)
        .get("/api/articles/string-not-an-integer")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal(
            'invalid input syntax for integer: "string-not-an-integer"'
          );
        });
    });
    it('ERROR / GET it returns a status 404 and a "Article Not Found" message when passed an article_id that does not exist in the database', () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Article Not Found");
        });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    it('returns a status 200 when patched with an object with a "inc_votes" key with a positive value and increases the number of votes on an article by that number - returning the updated article', () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.votes).to.equal(101);
          expect(article).to.have.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes"
          );
        });
    });
    it('returns a status 200 when patched with an object with a "inc_votes" key with a negative value and decreases the number of votes on an article by that number', () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -1 })
        .expect(200)
        .then(({ body: { article: { votes } } }) => {
          expect(votes).to.equal(99);
        });
    });
    it('ERROR returns a status 400 when sent an empty request body with no "inc_votes" value on it', () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal(
            "Bad Request - inc_votes missing from request body"
          );
        });
    });
    it('ERROR returns a status 400 when sent a patch with an invalid "inc_votes" value', () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "string-not-an-integer" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal('invalid input syntax for integer: "NaN"');
        });
    });
    it("ERROR returns a status 400 when sent a patch with additional keys", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1, more_votes: 3 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal(
            "Bad Request - must only contain inc_votes values"
          );
        });
    });
    it("ERROR returns a status 404 error when the article_id is not found", () => {
      return request(app)
        .patch("/api/articles/9999")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Article Not Found");
        });
    });
    it("ERROR returns a status 400 error when the article_id is not found", () => {
      return request(app)
        .patch("/api/articles/string-not-an-integer")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal(
            'invalid input syntax for integer: "string-not-an-integer"'
          );
        });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    it("returns a status 201 when posting a new comment, returns the posted comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge", body: "clever comment goes here" })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).to.have.keys(
            "comment_id",
            "author",
            "article_id",
            "body",
            "created_at",
            "votes"
          );
        });
    });
    it("ERROR - returns a status 404 when artilce_id is not found", () => {
      return request(app)
        .post("/api/articles/9999/comments")
        .send({ username: "butter_bridge", body: "clever comment goes here" })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Not Found");
        });
    });
    it("ERROR - returns a status 400 when artilce_id is in an invalid format", () => {
      return request(app)
        .post("/api/articles/string-not-an-integer/comments")
        .send({ username: "butter_bridge", body: "clever comment goes here" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal(
            'invalid input syntax for integer: "string-not-an-integer"'
          );
        });
    });
    it("ERROR - returns a status 404 when username is not found", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridges", body: "clever comment goes here" })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Not Found");
        });
    });
    it("ERROR - returns a status 400 when the body of the comment is left blank is not found", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge", body: "" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request - username and body required");
        });
    });
    it("ERROR - returns a status 400 when the username is not supplied", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ body: "Test" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request - username and body required");
        });
    });
    it("ERROR - returns a status 400 when the comment body is not supplied", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request - username and body required");
        });
    });
    it("ERROR - returns a status 404 when additional data is provided on additional keys", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge",
          body: "clever comment goes here",
          password: "some-string"
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request - Invalid key supplied");
        });
    });
    it('ERROR - gives a 405 status and "Method Not Allowed" when attempting to patch, put or delete comments', () => {
      const invalidMethods = ["patch", "put", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles/1/comments")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method Not Allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe.only("GET /api/articles/:article_id/comments", () => {
    it("returns a status 200 and an array of comments with the correct keys", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments[0]).to.have.keys(
            "comment_id",
            "votes",
            "created_at",
            "author",
            "body"
          );
        });
    });
    it("returns a 200 and sorts the results using a sort_by query", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=votes")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.descendingBy("votes");
        });
    });
    it("returns a 200 and sorts the results by created_at by default", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.descendingBy("created_at");
        });
    });
    it("returns a 200 and sorts the results in ascending order when the order query is specified ", () => {
      return request(app)
        .get("/api/articles/1/comments?order=asc")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.ascendingBy("created_at");
        });
    });
    it("returns a 200 and sorts the results in descending order by default", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.descendingBy("created_at");
        });
    });
  });
  describe("ERROR/not-a-route", () => {
    it('gives a 404 erorr and "Route Not Found" when using a route that does not exist', () => {
      return request(app)
        .get("/api/not-a-route")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Route Not Found");
        });
    });
  });
});
