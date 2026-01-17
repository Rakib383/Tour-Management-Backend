import { Router } from "express";
import { UserControllers } from "./user.controller";



export const UserRoutes = Router()


UserRoutes.post("/register",UserControllers.createUser)

