import { NextFunction, Request, Response } from "express"
import AppError from "../errorHelpers/AppError"
import { StatusCodes } from "http-status-codes"
import { verifyToken } from "../utils/jwt"
import { envVars } from "../../config/env"
import { JwtPayload } from "jsonwebtoken"
import { User } from "../modules/user/user.model"
import httpStatus from "http-status-codes"
import { IsActive } from "../modules/user/user.interface"

export const checkAuth = (...authRoles:string[]) =>  async(req: Request, res: Response, next: NextFunction) => {

try {
    
    const accessToken = req.headers.authorization

    if(!accessToken) {
        throw new AppError(StatusCodes.BAD_REQUEST,"no token recieved")
    }

    const verifiedToken = verifyToken(accessToken,envVars.JWT_ACCESS_SECRET) as JwtPayload

     const isUserExist = await User.findOne({ email:verifiedToken.email })


    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist")

    }
    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is blocked")

    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")

    }
    if (!isUserExist.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")

    }

    const role = verifiedToken.role

    if( !authRoles.includes(role)) {

        throw new AppError(StatusCodes.BAD_REQUEST,"you are not allowed")
    }



    req.user = verifiedToken

    next()

} catch (error) {

    // throw new AppError(StatusCodes.BAD_REQUEST,"invalid token ")
    next(error)
    
}

}