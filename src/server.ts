
import mongoose from "mongoose";
import {Server} from "http"
import app from "./app";
import 'dotenv/config'



let server :Server

const startServer = async () => {

    try {

        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.PASS}@cluster1.25zkwku.mongodb.net/tour-management-backend?appName=Cluster1`)

        console.log("connected to db");

        server = app.listen(5000, () => {
            console.log("server is listening on port 5000");
        })
        
    } catch (error) {
        console.log(error);
    }
}

startServer()

