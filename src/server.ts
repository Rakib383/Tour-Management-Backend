/* eslint-disable no-console */

import mongoose from "mongoose";
import {Server} from "http"
import app from "./app";
import 'dotenv/config'
import { envVars } from "./config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./config/redis.config";



let server :Server

const startServer = async () => {

    try {

        await mongoose.connect(`${envVars.DB_URL}`)

        console.log("connected to db");

        server = app.listen(5000, () => {
            console.log("server is listening on port 5000");
        })
        
    } catch (error) {
        console.log(error);
    }
}

(async ()=> {
    await connectRedis()
    await startServer()
    await seedSuperAdmin()
})()

process.on("unhandledRejection",(err) => {
    console.log(err);
    if(server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})

process.on("uncaughtException",(err) => {
    console.log(err);

    if(server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})

process.on("SIGTERM",() => {
    console.log("sigterm signal recieved.. server shutting down");

    if(server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})



