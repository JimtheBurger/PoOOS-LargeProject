const request = require("supertest");
const app = require("../server");

describe("Login to app", () => {
    it("should login with a non-verified user", async () => {
        const sampleInput = {
            username: "blankUserWithNoLists",
            password: "asdfasdf",
        };
        const sampleOutput = {
            User: {
                _id: "655a8cdc69d38ceb274620a4",
                Username: "blankUserWithNoLists",
                Password: "asdfasdf",
                Email: "person@example.com",
                Lists: [],
                Verified: false,
                EmailToken: "6969",
                UserId: 70,
            },
            ListInfo: "",
            Error: "Error: secretOrPrivateKey must have a value",
        };
        const response = await request(app)
            .post("/api/login")
            .send(sampleInput)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(sampleOutput);
    });
});

describe("Login to app", () => {
    it("should login with a verified user", async () => {
        const sampleInput = {
            username: "tester",
            password: "asdfasdf",
        };
        const sampleOutput = {
            User: {
                _id: "655758c4a2726e591dfefc90",
                Username: "tester",
                Password: "asdfasdf",
                Email: "jriesterer135@outlook.com",
                Lists: [157, 158, 160, 161, 162, 163, 164, 166, 167, 169, 170, 171, 173, 174],
                Verified: true,
                EmailToken: null,
                UserId: 61,
            },
            ListInfo: "",
            Error: "Error: secretOrPrivateKey must have a value",
        };
        const response = await request(app)
            .post("/api/login")
            .send(sampleInput)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(sampleOutput);
    });
});

describe("Search for a game", () => {
    it("should find a game based on its name", async () => {
        const sampleInput = {
            name: "Hollow Knight"
        };
        const sampleOutput = [
            {
                _id: "6555608758705727eaa8e55c",
                Name: "Hollow Knight",
                AppID: 367520,
                Description:
                    "Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes. Explore twisting caverns, battle tainted creatures and befriend bizarre bugs, all in a classic, hand-drawn 2D style.",
                Image: "https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg?t=1695270428",
                Genres: ["Action", "Adventure", "Indie"],
                Price: {
                    currency: "USD",
                    initial: 1499,
                    final: 1499,
                    discount_percent: 0,
                    initial_formatted: "",
                    final_formatted: "$14.99",
                },
                Developers: ["Team Cherry"],
                Publishers: ["Team Cherry"],
                Platforms: {
                    windows: true,
                    mac: true,
                    linux: true,
                },
                Release: {
                    coming_soon: false,
                    date: "Feb 24, 2017",
                },
            },
        ];
        const response = await request(app)
            .post("/api/searchGameName")
            .send(sampleInput)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(sampleOutput);
    });
});

describe("Search for a game with genre", () => {
    it("should fail to find a game with an invalid regex", async () => {
        const sampleInput = {
            name: "Factorio",
            genre: "Automation",
        };
        const sampleOutput = {
            Games: "",
            Error: "MongoServerError: $regex has to be a string",
        };
        const response = await request(app)
            .post("/api/searchGames")
            .send(sampleInput)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(sampleOutput);
    });
});

describe("Get games from list", () => {
    it("should reject an invalid JWT token", async () => {
        const sampleInput = {
            listID: "157",
            jwtToken: "",
        };
        const sampleOutput = {
            Error: "redirect",
        };
        const response = await request(app)
            .post("/api/getGamesFromList")
            .send(sampleInput)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(sampleOutput);
    });
});