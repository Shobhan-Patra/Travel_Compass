import express from "express";
import {errorHandler} from "./middlewares/errorHandler.ts";
import authenticateToken, {type AuthRequest} from "./middlewares/auth.ts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: express.Request, res: express.Response) => {
    res.json({
        "message": "Welcome to Travel Compass",
    })
})

import userRouter from "./routes/user.ts";

app.use("/api/v1/user", userRouter);
app.use('/api/v1', authenticateToken);
app.get('/api/v1/profile', (req: AuthRequest, res) => {
    res.status(200).json({
        "message": "Your profile",
        "yourData": req.user
    });
});

app.use(errorHandler);

export default app;