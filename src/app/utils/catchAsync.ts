/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";


type asyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void> 

export const catchAsync = (fn: asyncHandler) => (req: Request, res: Response, next: NextFunction) => {

    Promise.resolve(fn(req, res, next)).catch((err: any) => {

       

        next(err)
    })
}