/* eslint-disable @typescript-eslint/no-explicit-any */
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
import passport from "passport"
import { JwtPayload } from "jsonwebtoken"


const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    // const loginInfo = await AuthServices.credentialsLogin(req.body)

    passport.authenticate("local",async (err:any,user:any,info:any) => {

      if(err) {
        // return new AppError(401,err)

        return next(new AppError(401,err))
      }

      if(!user) {

        // return new AppError(401,info.message)
        return next(new AppError(401,info.message))
      }

        const userTokens = createUserTokens(user)

        delete user.toObject().password

      setAuthCookie(res,user)

    sendResponse(res,{
        success:true, 
        statusCode:httpStatus.OK,
        message:"user logged in successfully",
     data:{
      accessToken:userTokens.accessToken,
      refreshToken:userTokens.refreshToken,
      user
     },
    })
    })(req,res,next)

  

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



const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

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
const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const decodedToken = req.user as JwtPayload

  const {password} = req.body



 await AuthServices.setPassword(decodedToken.userId,password);

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"password setted successfully",
     data:null,
    })



 

})
const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const decodedToken = req.user;

  await AuthServices.resetPassword(req.body,decodedToken as JwtPayload);

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"password changed successfully",
     data:null,
    })

})

const forgetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  const {email} = req.body

  await AuthServices.forgetPassword(email);

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"email sent successfully",
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
forgetPassword,
setPassword,
googleCallbackController,
changePassword
}