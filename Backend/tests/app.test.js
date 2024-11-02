import request from "supertest";
import app from "../src/index.js";

describe("Express API Endpoints", () => {
  it("GET / should return a greet message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Welcome to the Express API");
  });
});
