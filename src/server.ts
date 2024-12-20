import express from "express";
import cors from "cors";
import morgan from "morgan";

import indexRouter from "./routes/index";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV != "production") {
    app.use(morgan('dev'));
}

app.use("/v1", indexRouter());

export default app;
