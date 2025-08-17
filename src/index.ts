import express  from "express";
import helmet from "helmet";
import { ErrorMiddleware } from "./Middleware/Error.middleware";
import { GlobalEnv } from "./Config/GlobalEnv";

const app = express();

app.use([
    express.json(),
    express.urlencoded({extended: true}),
    helmet(),
])

app.use(ErrorMiddleware)

app.listen(GlobalEnv.PORT)