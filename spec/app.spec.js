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
    describe('Error handling', () => {
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
    describe('Error handling', () => {
      it("ERROR - returns a status 404 and a message indicating the user was not found when an invalid username is requested", () => {
        return request(app)
          .get("/api/users/not-valid-user")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("User Not Found");
          });
      });
      it('ERROR - gives a 405 status and "Method Not Allowed" when attempting to post, patch, put or delete users by username', () => {
        const invalidMethods = ["post", "patch", "put", "delete"];
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
          expect(+article.comment_count).to.equal(0);
        });
    });
    describe('Error handling', () => {
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
    it('returns a status 200 when sent an empty request body with no "inc_votes" value on it and returns the article with the votes unchanged', () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(200)
        .then(({ body: { article: { votes } } }) => {
          expect(votes).to.equal(100);
        });
    });
    it("returns a status 200 when no body is sent and returns the article with the votes unchanged", () => {
      return request(app)
        .patch("/api/articles/1")
        .expect(200)
        .then(({ body: { article: { votes } } }) => {
          expect(votes).to.equal(100);
        });
    });
    describe('Error handling', () => {
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
      it("ERROR returns a status 400 error when the article_id is in an invalid format", () => {
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
    describe('Error handling', () => {
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
      it("ERROR - returns a status 400 when the username is not supplied", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ body: "Test" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('null value in column "author" violates not-null constraint');
          });
      });
      it("ERROR - returns a status 400 when the username key is not correct", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ user: "butter_bridge", body: "Test" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('null value in column "author" violates not-null constraint');
          });
      });
      it("ERROR - returns a status 400 when the comment body is not supplied", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: "butter_bridge" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('null value in column "body" violates not-null constraint');
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
      it("ERROR - returns a status 400 and an error message when no body is supplied", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('null value in column "author" violates not-null constraint');
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
  });
  describe("GET /api/articles/:article_id/comments", () => {
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
    it("returns a status 200 and sorts the results using a sort_by query", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=votes")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.descendingBy("votes");
        });
    });
    it("returns a status 200 and sorts the results by created_at by default", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.descendingBy("created_at");
        });
    });
    it("returns a status 200 and sorts the results in ascending order when the order query is specified ", () => {
      return request(app)
        .get("/api/articles/1/comments?order=asc")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.ascendingBy("created_at");
        });
    });
    it("returns a status 200 and sorts the results in descending order by default", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.descendingBy("created_at");
        });
    });
    it("returns a 200 status when passed an article_id that has no comments but is valid and serves an empty array", () => {
      return request(app)
        .get("/api/articles/10/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.eql([]);
        });
    });
    describe('', () => {
      it("ERROR - returns a 404 and article not found message when passed an article_id that does not exist", () => {
        return request(app)
          .get("/api/articles/9999/comments")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Article Not Found");
          });
      });
      it("ERROR - returns a 400 and Bad Request message when passed an article_id that is invalid", () => {
        return request(app)
          .get("/api/articles/string-not-an-integer/comments")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal(
              'invalid input syntax for integer: "string-not-an-integer"'
            );
          });
      });
      it("ERROR - returns a 400 error when sorted by an invalid column", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=invalid-column")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('column "invalid-column" does not exist');
          });
      });
      it("ERROR - returns a 400 error when ordered by an invalid value", () => {
        return request(app)
          .get("/api/articles/1/comments?order=invaid-input")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Invalid sort order");
          });
      });
    });
  });
  describe('GET /api/articles', () => {
    it('returns a 200 status and an array of all the article objects with the correct keys', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0]).to.contain.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes')
        })
    })
    it('returns a 200 status and each article has a key of comment_count', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0]).to.contain.keys('comment_count')
        })
    })
    it("returns a status 200 and sorts the results by the column provided", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.descendingBy("votes");
        });
    });
    it("returns a status 200 and sorts the results by created_at by default", () => {
      return request(app)
        .get("/api/articles/")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.descendingBy("created_at");
        });
    });
    it("returns a status 200 and sorts the results in ascending order when the order query is specified ", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.ascendingBy("created_at");
        });
    });
    it("returns a status 200 and sorts the results in descending order by default", () => {
      return request(app)
        .get("/api/articles/")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.descendingBy("created_at");
        });
    });
    it("returns a status 200 and filters the articles by username specified in a author query", () => {
      return request(app)
        .get("/api/articles?author=butter_bridge")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.every(article => article.author === 'butter_bridge')).to.be.true;
          expect(articles.length).to.equal(3)
        });
    });
    it("returns a status 200 and an empty array if passed a user that exists but has no articles", () => {
      return request(app)
        .get("/api/articles?author=lurker")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.eql([])
        });
    });
    it("returns a status 200 and filters the articles by topic specified in a topic query", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.every(article => article.topic === 'cats')).to.be.true;
          expect(articles.length).to.equal(1)
        });
    });
    it("returns a status 200 and reutns an empty array when there are no articles on the topic", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.every(article => article.topic === 'cats')).to.be.true;
          expect(articles).to.eql([])
        });
    });
    describe('Error handling', () => {
      it("ERROR - returns a 400 error when sorted by an invalid column", () => {
        return request(app)
          .get("/api/articles?sort_by=invalid-column")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('column "invalid-column" does not exist');
          });
      });
      it("ERROR - returns a 400 error when ordered by an invalid value", () => {
        return request(app)
          .get("/api/articles?order=invaid-input")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Invalid sort order");
          });
      });
      it("ERROR - returns a 404 error when an author is not found", () => {
        return request(app)
          .get("/api/articles?author=mickey-mouse")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("User Not Found");
          });
      });
      it("ERROR - returns a 404 error when an topic is not found", () => {
        return request(app)
          .get("/api/articles?topic=disney-films")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Topic Not Found");
          });
      });
      it('ERROR - gives a 405 status and "Method Not Allowed" when attempting to post, patch, put or delete topics', () => {
        const invalidMethods = ["post", "patch", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
          [method]("/api/articles")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method Not Allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
    describe('Pagination - limit, page and total_count', () => {
      it('returns a 200 status taking a query - limit - which limits the number of responses served', () => {
        return request(app)
          .get("/api/articles?limit=5")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(5)
          });
      });
      it('returns a 200 status and limits the response to 10 result by default', () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(10)
          });
      });
      it('returns a 200 status taking a query - p - which selects the page of results by using an offset', () => {
        return request(app)
          .get("/api/articles?p=2")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(2)
          });
      });
      it('returns a 200 status and adds a total_count to the response which is the total count of articles', () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { total_count } }) => {
            expect(total_count).to.equal(12)
          });
      });
    });
    it('returns a 200 status total count takes author query into account when returning the total number of articles', () => {
      return request(app)
        .get("/api/articles?author=butter_bridge")
        .expect(200)
        .then(({ body: { total_count } }) => {
          expect(total_count).to.equal(3)
        });
    });
    it('returns a 200 status total count takes topic query into account when returning the total number of articles', () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { total_count } }) => {
          expect(total_count).to.equal(11)
        });
    });
    it("returns a 200 status when passed a page query too large - so no artile on the page", () => {
      return request(app)
        .get("/api/articles?p=9999")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.eql([])
        });
    });
    describe('Error handling - Pagination', () => {
      it("ERROR - returns a 400 error when limit is passed a string", () => {
        return request(app)
          .get("/api/articles?limit=invaid-input")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Limit must be a positive number");
          });
      });
      it("ERROR - returns a 400 error when limit is passed a negative number", () => {
        return request(app)
          .get("/api/articles?limit=-2")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Limit must be a positive number");
          });
      });
      it("ERROR - returns a 400 error when the page query is passed a string", () => {
        return request(app)
          .get("/api/articles?p=invaid-input")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("p must be a positive number");
          });
      });
      it("ERROR - returns a 400 error when the page query is passed a negative number", () => {
        return request(app)
          .get("/api/articles?p=-2")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("p must be a positive number");
          });
      });
      it("ERROR - returns a 400 error when the page query is passed 0", () => {
        return request(app)
          .get("/api/articles?p=0")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("p must be a positive number");
          });
      });
    });
  });
  describe('PATCH /api/comments/:comment_id', () => {
    it('returns a status 200 when patched with an object with a "inc_votes" key with a positive value and increases the number of votes on a comment by that number - returning the updated comment', () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 10 })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).to.equal(26);
          expect(comment).to.have.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
        });
    });
    it('returns a status 200 when patched with an object with a "inc_votes" key with a negative value and decreases the number of votes on an article by that number', () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: -10 })
        .expect(200)
        .then(({ body: { comment: { votes } } }) => {
          expect(votes).to.equal(6);
        });
    });
    it('returns a status 200 when sent an empty request body with no "inc_votes" value on it and returns the comment unchanged', () => {
      return request(app)
        .patch("/api/comments/1")
        .send({})
        .expect(200)
        .then(({ body: { comment: { votes } } }) => {
          expect(votes).to.equal(16);
        });
    });
    it("ERROR returns a status 200 when no body is sent", () => {
      return request(app)
        .patch("/api/comments/1")
        .expect(200)
        .then(({ body: { comment: { votes } } }) => {
          expect(votes).to.equal(16);
        });
    })
    describe('Error handling', () => {
      it('ERROR returns a status 400 when sent a patch with an invalid "inc_votes" value', () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: "string-not-an-integer" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('invalid input syntax for integer: "NaN"');
          });
      });
      it("ERROR returns a status 400 when sent a patch with additional keys", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 1, more_votes: 3 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal(
              "Bad Request - must only contain inc_votes values"
            );
          });
      });
      it("ERROR returns a status 400 error when the article_id is in an invalid format", () => {
        return request(app)
          .patch("/api/comments/string-not-an-integer")
          .send({ inc_votes: 1 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal(
              'invalid input syntax for integer: "string-not-an-integer"'
            );
          });
      });
      it("ERROR returns a status 404 error when the article_id is not found", () => {
        return request(app)
          .patch("/api/comments/9999")
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Article Not Found");
          });
      });
      it('ERROR gives a 405 status and "Method Not Allowed" when attempting to get, post or put topics', () => {
        const invalidMethods = ["get", "post", "put"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
          [method]("/api/comments/1")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method Not Allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
  describe('DELETE /api/comments/:comment_id', () => {
    it('returns a status 204 deleting the comment from the database', () => {
      return request(app)
        .delete('/api/comments/1')
        .expect(204)
    });
    describe('Error handling', () => {
      it('ERROR returns a status 404 when attempting to delete a comment that does not exist', () => {
        return request(app)
          .delete('/api/comments/9999')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Comment Not Found')
          })
      })
      it('ERROR returns a status 400 when attempting to delete a comment that does not exist', () => {
        return request(app)
          .delete('/api/comments/not-a-valid-id')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('invalid input syntax for integer: "not-a-valid-id"')
          })
      });
    });
  });
  describe('GET /api', () => {
    it('returns a status 200 and an object with the API spec', () => {
      return request(app)
        .get('/api/')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.contain.keys("GET /api",
            "GET /api/topics",
            "GET /api/articles",
            "GET /api/users/:username",
            "GET /api/articles/:article_id",
            "PATCH /api/articles/:article_id",
            "GET /api/articles/:article_id/comments",
            "POST /api/articles/:article_id/comments",
            "PATCH /api/comments/:comment_id",
            "DELETE /api/comments/:comment_id")
        })
    });
    describe('Error handling', () => {
      it('ERROR - gives a 405 status and "Method Not Allowed" when attempting to post, patch, put or delete', () => {
        const invalidMethods = ["post", "patch", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
          [method]("/api")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method Not Allowed");
            });
        });
        return Promise.all(methodPromises);
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
