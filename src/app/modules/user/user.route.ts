import { Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";


export const UserRoutes = Router()



UserRoutes.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser)

UserRoutes.get("/all-users",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), UserControllers.getAllUsers)
UserRoutes.get("/me",checkAuth(...Object.values(Role)), UserControllers.getMe)


UserRoutes.patch("/:id",validateRequest(updateUserZodSchema),checkAuth(...Object.values(Role)),UserControllers.updateUser)

