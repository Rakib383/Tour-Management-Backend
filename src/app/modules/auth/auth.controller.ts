/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import httpStatus from "http-status-codes"
import { sendResponse } from "../../utils/sendResponse"
import { AuthServices } from "./auth.service"
import AppError from "../../errorHelpers/AppError"
import { setAuthCookie } from "../../utils/setCookie"
import { createUserTokens } from "../../utils/userTokens"
import { envVars } from "../../../config/env"


const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const loginInfo = await AuthServices.credentialsLogin(req.body)

  setAuthCookie(res,loginInfo)

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"user logged in successfully",
     data:loginInfo,
    })

})


const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken

    if(!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST,"no refresh token received")
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken)

    setAuthCookie(res,tokenInfo)

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"new access token retrived successfully",
     data:tokenInfo,
    })

})



const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const decodedToken = req.user!;
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;

  await AuthServices.resetPassword(oldPassword,newPassword,decodedToken);

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"password changed successfully",
     data:null,
    })

})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  res.clearCookie("accessToken",{
    httpOnly:true,
    secure:false,
    sameSite:"lax"
  })

  res.clearCookie("refreshToken",{
    httpOnly:true,
    secure:false,
    sameSite:"lax"
  })


    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"user logged out successfully",
     data:null,
    })

})

const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

let redirectTo = req.query.state ? req.query.state as string : ""

if(redirectTo.startsWith("/")) {
  redirectTo = redirectTo.slice(1)
}


const user = req.user

if (!user) {
  throw new AppError(httpStatus.NOT_FOUND,"user not found")
}

const tokenInfo = createUserTokens(user)

setAuthCookie(res,tokenInfo)


    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)

})



export const AuthControllers = {
credentialsLogin,
getNewAccessToken,
logout,
resetPassword,
googleCallbackController
}