const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("GET /api/topics", () => {
  test("200: returns an array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBe(3);
        res.body.forEach((topic) => {
          expect(topic).toEqual({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("404: incorrect path returns 'path not found'", () => {
    return request(app).get("/api/topic").expect(404);
  });
});

describe("GET /api/article/:article_id", () => {
  test("200: returns copy of requested article object", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual({
          author: "icellusedkars",
          title: "Sony Vaio; or, The Laptop",
          article_id: 2,
          body: expect.any(String),
          topic: "mitch",
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
  test("404; article id not in database", () => {
    return request(app)
      .get("/api/articles/765")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid article_id");
      });
  });
  test("400: article_id is not a number", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("article_id is not a number");
      });
  });
});
