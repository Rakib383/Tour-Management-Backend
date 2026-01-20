/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus, { StatusCodes } from "http-status-codes"
import { UserServices } from "./user.service";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";






const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = await UserServices.createUser(req.body)

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"user created successfully",
        data:user
    })

})


const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const users = await UserServices.getAllUsers()

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"all users retrieved",
        data:users,
        })

})





export const UserControllers = {
    createUser,
    getAllUsers
}