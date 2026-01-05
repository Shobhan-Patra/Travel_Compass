import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
    res.json({
        "message": "Welcome to Travel Compass",
    })
})

export default app;