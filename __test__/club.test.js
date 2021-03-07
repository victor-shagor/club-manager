import request from "supertest";
import app from "../server/app";

describe("post route test", () => {
  let token;
  it("should signup a user to get token", async (done) => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "doe@example.com",
      password: "password",
    });
    token = res.body.data.token;
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("data");
    done();
  });

  it("create a club", async (done) => {
    const res = await request(app).post("/api/clubs").set({
      token: token,
    }).send({
        name:'Banger'
    })
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("data");
    done();
  });

  it("get clubs", async (done) => {
    const res = await request(app).get("/api/clubs").set({
      token: token,
    });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data");
    done();
  });

  it("add member to club", async (done) => {
    const res = await request(app).post("/api/clubs/member?email=doe@example.com&club_id=1&club_name=Banger").set({
      token: token,
    });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("data");
    done();
  });

  it("should not add a member who is not a registered user", async (done) => {
    const res = await request(app).post("/api/clubs/member?email=doertz@example.com&club_id=1&club_name=Banger").set({
      token: token,
    });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("error");
    done();
  });
})