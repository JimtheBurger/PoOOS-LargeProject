const request = require("supertest");
const app = require("../server");

describe("Login to app", () => {
    it("should receive user information upon sending their username and password", async () => {
        const sampleInput = {
            login: "rickl",
            password: "COP4331",
        };
        const sampleOutput = {
            firstName: "Rick",
            lastName: "Leinecker",
            id: "1",
            error: "",
        };
        const response = await request(app)
            .post("/api/login")
            .send(sampleInput)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(sampleOutput);
    });
});
