/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus, { StatusCodes } from "http-status-codes"
import { UserServices } from "./user.service";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";






const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = await UserServices.createUser(req.body)

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"user created successfully",
        data:user
    })

})

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.params.id;
   const verifiedToken = req.user
    const payload = req.body;

    const user = await UserServices.updateUser(userId as string,payload,verifyToken)

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"user updated successfully",
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

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req.user as JwtPayload

    const result = await UserServices.getMe(decodedToken.userId)

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"user info retrieved",
        data:result.data
        })

})





export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser,
    getMe
}