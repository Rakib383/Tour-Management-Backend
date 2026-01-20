/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../../config/env"
import AppError from "../errorHelpers/AppError"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler = (err:any,req:Request,res:Response,next:NextFunction) => {
    let statusCode = 500

    if(err instanceof AppError) {
        statusCode = err.statusCode
    }

    res.status(statusCode).json({
        success:false,
        message:`something wrong ${err.message}`,
        err,
        stack:envVars.NODE_ENV === "development" ? err.stack : null
    })
} 