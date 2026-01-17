
import express, { Request, Response } from "express"
import { UserRoutes } from "./app/modules/user/user.route"
import cors from "cors"
import { router } from "./routes"

const app = express()
app.use(express.json())
app.use(cors())


app.use("/api/v1/",router)


app.get("/",(req:Request,res:Response) => {

    res.send("server is working hard")
})


export default app