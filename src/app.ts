
import express, { Request, Response } from "express"

import cors from "cors"
import { router } from "./routes"
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler"
import { notFound } from "./app/middlewares/notFound"
import cookieParser from "cookie-parser"

const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser());


app.use("/api/v1/",router)


app.get("/",(req:Request,res:Response) => {

    res.send("server is working hard")
})


app.use(globalErrorHandler)

app.use(notFound)


export default app