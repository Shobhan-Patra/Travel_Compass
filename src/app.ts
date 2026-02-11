import express from "express";
import {errorHandler} from "./middlewares/errorHandler.ts";
import authenticateToken from "./middlewares/auth.ts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_: express.Request, res: express.Response) => {
    res.json({
        "message": "Welcome to Travel Compass",
    })
})

import userRouter from "./routes/user.ts";
import postRouter from "./routes/post.ts";
import destinationRouter from "./routes/destination.ts";

app.use("/api/v1/user", userRouter);

app.use('/api/v1', authenticateToken);
app.use('/api/v1/post', postRouter);
app.use('/api/v1/destination', destinationRouter);

app.use(errorHandler);

export default app;