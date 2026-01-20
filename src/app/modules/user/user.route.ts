import { Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";


export const UserRoutes = Router()




UserRoutes.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser)

UserRoutes.get("/all-users", UserControllers.getAllUsers)

