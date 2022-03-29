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

describe.only("GET /api/users", () => {
  test("200: returns array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body.users.length).toBe(4);
        expect(res.body.users[1]).toEqual({ username: "icellusedkars" });
        res.body.users.forEach((user) => {
          expect(user).toEqual({
            username: expect.any(String),
          });
        });
      });
  });
  test("404: incorrect file path", async () => {
    const res = await request(app).get("/api/user").expect(404);
    expect(res.body.msg).toBe("path not found");
  });
});
