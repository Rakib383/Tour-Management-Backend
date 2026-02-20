import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";
import { DivisionController } from "./division.controller";



export const DivisionRoutes= Router()


DivisionRoutes.post(
    "/create",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createDivisionSchema),
    DivisionController.createDivision
);
DivisionRoutes.get("/", DivisionController.getAllDivisions);
DivisionRoutes.get("/:slug", DivisionController.getSingleDivision)
DivisionRoutes.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateDivisionSchema),
    DivisionController.updateDivision
);
DivisionRoutes.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.deleteDivision);