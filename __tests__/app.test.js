const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("TOPICS", () => {
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
});

describe("ARTICLES", () => {
  describe("GET /api/articles", () => {
    test("200: returns array of article objects", async () => {
      const res = await request(app).get("/api/articles").expect(200);
      expect(res.body.articles).toHaveLength(12);
      res.body.articles.forEach((article) => {
        expect(article).toEqual({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        });
      });
    });
    test("200: articles are sorted by date order descending", async () => {
      const res = await request(app).get("/api/articles").expect(200);
      expect(res.body.articles).toBeSorted({
        key: "created_at",
        descending: true,
        coerce: true,
      });
    });
    test("400: incorrect path", async () => {
      await request(app).get("/api/article").expect(404);
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("200: returns copy of requested article object including comment count", async () => {
      const res = await request(app).get("/api/articles/9").expect(200);
      expect(res.body.article).toEqual({
        author: "butter_bridge",
        title: "They're not exactly dogs, are they?",
        article_id: 9,
        body: "Well? Think about it.",
        topic: "mitch",
        created_at: expect.any(String),
        votes: 0,
        comment_count: 2,
      });
    });
    test("200: returns copy of requested article object which has zero comments", async () => {
      const res = await request(app).get("/api/articles/2").expect(200);
      expect(res.body.article).toEqual({
        author: "icellusedkars",
        title: "Sony Vaio; or, The Laptop",
        article_id: 2,
        body: expect.any(String),
        topic: "mitch",
        created_at: expect.any(String),
        votes: 0,
        comment_count: 0,
      });
    });
    test("404; article id not in database", async () => {
      const res = await request(app).get("/api/articles/765").expect(404);
      expect(res.body.msg).toBe("Invalid article_id");
    });
    test("400: article_id is not a number", async () => {
      const res = await request(app).get("/api/articles/cheese").expect(400);
      expect(res.body.msg).toBe("article_id is not a number");
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("200: returns array of comments in the required format", async () => {
      const res = await request(app)
        .get("/api/articles/9/comments")
        .expect(200);
      expect(res.body.comments).toHaveLength(2);
      res.body.comments.forEach((comment) => {
        expect(comment).toEqual({
          comment_id: expect.any(Number),
          body: expect.any(String),
          article_id: expect.any(Number),
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
    });
    test("200: article_id with zero comments returns an empty array", async () => {
      const res = await request(app)
        .get("/api/articles/4/comments")
        .expect(200);
      expect(res.body.comments).toHaveLength(0);
    });
    test("404: article_id does not exist", async () => {
      const res = await request(app)
        .get("/api/articles/100/comments")
        .expect(404);
      expect(res.body.msg).toBe("Invalid article_id");
    });
    test("400: article id is not a number", async () => {
      const res = await request(app)
        .get("/api/articles/cheese/comments")
        .expect(400);
      expect(res.body.msg).toBe("article_id is not a number");
    });
    test("404: incorrect path", async () => {
      await request(app).get("/api/articles/1/comment").expect(404);
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
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
    test("400: inc_votes value is not number", async () => {
      const articleUpdate = { inc_votes: "hello" };
      const res = await request(app)
        .patch("/api/articles/1")
        .send(articleUpdate)
        .expect(400);
      expect(res.body.msg).toBe("invalid request");
    });
  });
});

describe("USERS", () => {
  describe("GET /api/users", () => {
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
      expect(res.body.msg).toBe("Path not found");
    });
  });
});
