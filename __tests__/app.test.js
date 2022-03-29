const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("GET /api/topics", () => {
  test("200: returns an array", async () => {
    const res = await request(app).get("/api/topics").expect(200);
    expect(res.body.length).toBe(3);
    res.body.forEach((topic) => {
      expect(topic).toEqual({
        slug: expect.any(String),
        description: expect.any(String),
      });
    });
  });
  test("404: incorrect path returns 'path not found'", async () => {
    await request(app).get("/api/topic").expect(404);
  });
});

describe("GET /api/article/:article_id", () => {
  test("200: returns copy of requested article object", async () => {
    const res = await request(app).get("/api/articles/2").expect(200);
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
  test("404; article id not in database", async () => {
    const res = await request(app).get("/api/articles/765").expect(404);
    expect(res.body.msg).toBe("Invalid article_id");
  });
  test("400: article_id is not a number", async () => {
    const res = await request(app).get("/api/articles/hello").expect(400);
    expect(res.body.msg).toBe("article_id is not a number");
  });
});

describe.only("PATCH /api/articles/:article_id", () => {
  test("200: responds with a copy of the updated article object", async () => {
    const articleUpdate = { inc_votes: 1 };
    const res = await request(app)
      .patch("/api/articles/1")
      .send(articleUpdate)
      .expect(200);
    expect(res.body.updatedArticle).toEqual({
      author: "butter_bridge",
      title: "Living in the shadow of a great man",
      article_id: 1,
      body: expect.any(String),
      topic: "mitch",
      created_at: expect.any(String),
      votes: 101,
    });
  });
  test("200: decreases votes by required number", async () => {
    const articleUpdate = { inc_votes: -1 };
    const res = await request(app)
      .patch("/api/articles/1")
      .send(articleUpdate)
      .expect(200);
    expect(res.body.updatedArticle).toEqual({
      author: "butter_bridge",
      title: "Living in the shadow of a great man",
      article_id: 1,
      body: expect.any(String),
      topic: "mitch",
      created_at: expect.any(String),
      votes: 99,
    });
  });
  test("404: article_id not in database", async () => {
    const articleUpdate = { inc_votes: 1 };
    const res = await request(app)
      .patch("/api/articles/100")
      .send(articleUpdate)
      .expect(404);
    expect(res.body.msg).toBe("Invalid article_id");
  });
  test("400: article_id is not a number", async () => {
    const articleUpdate = { inc_votes: 1 };
    const res = await request(app)
      .patch("/api/articles/cat")
      .send(articleUpdate)
      .expect(400);
    expect(res.body.msg).toBe("article_id is not a number");
  });
  test("400: patch body does not contain inc_votes key", async () => {
    const articleUpdate = { votes: 1 };
    const res = await request(app)
      .patch("/api/articles/1")
      .send(articleUpdate)
      .expect(400);
    expect(res.body.msg).toBe("invalid request");
  });
  test.only("400: inc_votes value is not number", async () => {
    const articleUpdate = { inc_votes: "hello" };
    const res = await request(app)
      .patch("/api/articles/1")
      .send(articleUpdate)
      .expect(400);
    expect(res.body.msg).toBe("invalid request");
  });
});
