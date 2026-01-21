import { Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";


export const UserRoutes = Router()



UserRoutes.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser)

UserRoutes.get("/all-users",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), UserControllers.getAllUsers)

