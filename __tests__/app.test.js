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
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
        });
      });
    });
    test("404: incorrect path returns 'path not found'", async () => {
      const res = await request(app).get("/api/topic").expect(404);
      expect(res.body.msg).toBe("Path not found");
    });
  });
});

describe("ARTICLES", () => {
  describe("GET /api/articles", () => {
    test("200: returns array of article objects", async () => {
      const { body } = await request(app).get("/api/articles").expect(200);
      expect(body.articles).toHaveLength(12);
      body.articles.forEach((article) => {
        expect(article).toMatchObject({
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
      const { body } = await request(app).get("/api/articles").expect(200);
      expect(body.articles).toBeSorted({
        key: "created_at",
        descending: true,
        coerce: true,
      });
    });
    test("404: incorrect path", async () => {
      const { body } = await request(app).get("/api/article").expect(404);
      expect(body.msg).toBe("Path not found");
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("200: returns copy of requested article object including comment count", async () => {
      const { body } = await request(app).get("/api/articles/9").expect(200);
      expect(body.article).toMatchObject({
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
      const { body } = await request(app).get("/api/articles/2").expect(200);
      expect(body.article).toEqual({
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
      const { body } = await request(app).get("/api/articles/765").expect(404);
      expect(body.msg).toBe("Invalid article_id");
    });
    test("400: article_id is not a number", async () => {
      const { body } = await request(app)
        .get("/api/articles/cheese")
        .expect(400);
      expect(body.msg).toBe("article_id is not a number");
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("200: returns array of comments in the required format", async () => {
      const { body } = await request(app)
        .get("/api/articles/9/comments")
        .expect(200);
      expect(body.comments).toHaveLength(2);
      body.comments.forEach((comment) => {
        expect(comment).toMatchObject({
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
      const { body } = await request(app)
        .get("/api/articles/4/comments")
        .expect(200);
      expect(body.comments).toHaveLength(0);
    });
    test("404: article_id does not exist", async () => {
      const { body } = await request(app)
        .get("/api/articles/100/comments")
        .expect(404);
      expect(body.msg).toBe("Invalid article_id");
    });
    test("400: article id is not a number", async () => {
      const { body } = await request(app)
        .get("/api/articles/cheese/comments")
        .expect(400);
      expect(body.msg).toBe("article_id is not a number");
    });
    test("404: incorrect path", async () => {
      const { body } = await request(app)
        .get("/api/articles/1/comment")
        .expect(404);
      expect(body.msg).toBe("Path not found");
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    test("200: responds with a copy of the updated article object", async () => {
      const articleUpdate = { inc_votes: 1 };
      const { body } = await request(app)
        .patch("/api/articles/1")
        .send(articleUpdate)
        .expect(200);
      expect(body.updatedArticle).toMatchObject({
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
      const { body } = await request(app)
        .patch("/api/articles/1")
        .send(articleUpdate)
        .expect(200);
      expect(body.updatedArticle).toMatchObject({
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
      const { body } = await request(app)
        .patch("/api/articles/100")
        .send(articleUpdate)
        .expect(404);
      expect(body.msg).toBe("Invalid article_id");
    });
    test("400: article_id is not a number", async () => {
      const articleUpdate = { inc_votes: 1 };
      const { body } = await request(app)
        .patch("/api/articles/cat")
        .send(articleUpdate)
        .expect(400);
      expect(body.msg).toBe("article_id is not a number");
    });
    test("400: patch body does not contain inc_votes key", async () => {
      const articleUpdate = { votes: 1 };
      const { body } = await request(app)
        .patch("/api/articles/1")
        .send(articleUpdate)
        .expect(400);
      expect(body.msg).toBe("invalid request");
    });
    test("400: inc_votes value is not number", async () => {
      const articleUpdate = { inc_votes: "hello" };
      const { body } = await request(app)
        .patch("/api/articles/1")
        .send(articleUpdate)
        .expect(400);
      expect(body.msg).toBe("invalid request");
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("201: returns a copy of the posted article", async () => {
      const comment = { username: "butter_bridge", body: "This is a comment" };
      const { body } = await request(app)
        .post("/api/articles/9/comments")
        .send(comment)
        .set("Accept", "application/json")
        .expect(201);
      expect(body.comment).toMatchObject({
        comment_id: expect.any(Number),
        body: "This is a comment",
        article_id: 9,
        author: "butter_bridge",
        votes: 0,
        created_at: expect.any(String),
      });
    });
    test("404: article_id does not exist", async () => {
      const comment = { username: "butter_bridge", body: "This is a comment" };
      const { body } = await request(app)
        .post("/api/articles/100/comments")
        .send(comment)
        .expect(404);
      expect(body.msg).toBe("Invalid article_id");
    });
    test("400: article_id not a number", async () => {
      const comment = { username: "butter_bridge", body: "This is a comment" };
      const { body } = await request(app)
        .post("/api/articles/cheese/comments")
        .send(comment)
        .expect(400);
      expect(body.msg).toBe("article_id is not a number");
    });
    test("400: post body does not include the keys of username and body", async () => {
      const comment = {
        cheese: "butter_bridge",
        biscuits: "This is a comment",
      };
      const { body } = await request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(400);
      expect(body.msg).toBe("posted body is incomplete");
    });
    test("400: no body posted", async () => {
      const { body } = await request(app)
        .post("/api/articles/1/comments")
        .send()
        .expect(400);
      expect(body.msg).toBe("posted body is incomplete");
    });
    test("400: values in posted object are not required type", async () => {
      const comment = { username: 10, body: true };
      const { body } = await request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(400);
      expect(body.msg).toBe("invalid request");
    });
  });
});

describe("USERS", () => {
  describe("GET /api/users", () => {
    test("200: returns array of user objects", async () => {
      const { body } = await request(app).get("/api/users").expect(200);
      expect(body.users.length).toBe(4);
      expect(body.users[1]).toEqual({ username: "icellusedkars" });
      body.users.forEach((user) => {
        expect(user).toEqual({
          username: expect.any(String),
        });
      });
    });
    test("404: incorrect file path", async () => {
      const { body } = await request(app).get("/api/user").expect(404);
      expect(body.msg).toBe("Path not found");
    });
  });
});

describe("QUERIES for GET /api/articles", () => {
  describe("sort_by", () => {
    test("200: sorts by provided column value", async () => {
      const { body } = await request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200);

      expect(body.articles).toBeSorted({
        key: "votes",
        descending: true,
      });
    });
    test("200: sorts by another column value", async () => {
      const { body } = await request(app)
        .get("/api/articles?sort_by=author")
        .expect(200);
      expect(body.articles).toBeSorted({
        key: "author",
        descending: true,
      });
    });
    test("400: sort_by is not a valid column", async () => {
      const { body } = await request(app)
        .get("/api/articles?sort_by=cheese")
        .expect(400);
      expect(body.msg).toBe("Invalid query");
    });
  });
  describe("order", () => {
    test("200: ?order=ASC or DESC orders results accordingly", async () => {
      const { body } = await request(app)
        .get("/api/articles?order=ASC")
        .expect(200);
      expect(body.articles).toBeSortedBy("created_at");
    });
    test("400: invalid order value", async () => {
      const { body } = await request(app)
        .get("/api/articles?order=cheese")
        .expect(400);
      expect(body.msg).toBe("Invalid query");
    });
    test("200: order by is case insensitive", async () => {
      const { body } = await request(app)
        .get("/api/articles?order=asc")
        .expect(200);
      expect(body.articles).toBeSortedBy("created_at");
    });
  });
  describe("filter by TOPIC", () => {
    test("200: results are filtered by valid topic", async () => {
      const { body } = await request(app)
        .get("/api/articles?topic=mitch")
        .expect(200);
      body.articles.forEach((article) => {
        expect(article.topic).toBe("mitch");
      });
    });
    test("400: topic value does not exist", async () => {
      const { body } = await request(app)
        .get("/api/articles?topic=cheese")
        .expect(400);
      expect(body.msg).toBe("Topic does not exist");
    });
  });
  describe("filter by author", () => {
    test("200: results are filtered by valid author", async () => {
      const { body } = await request(app)
        .get("/api/articles?author=rogersop")
        .expect(200);
      body.articles.forEach((article) => {
        expect(article.author).toBe("rogersop");
      });
    });
    test("400: author value does not exist", async () => {
      const { body } = await request(app)
        .get("/api/articles?author=bob")
        .expect(400);
      expect(body.msg).toBe("Author does not exist");
    });
  });
});
