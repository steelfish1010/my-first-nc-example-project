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
  test("404: incorrect file path", () => {
    return request(app).get("/api/user").expect(404);
  });
});
