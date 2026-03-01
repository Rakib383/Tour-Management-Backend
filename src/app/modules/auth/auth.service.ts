/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { createNewAccessTokenWithRefreshToken} from "../../utils/userTokens";
// import { IUser } from "../user/user.interface";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../../config/env";
import { IAuthProvider } from "../user/user.interface";

// const credentialsLogin = async (payload:Partial<IUser>) => {

//     const {email,password} = payload

//      const isUserExist = await User.findOne({ email })

//     if (!isUserExist) {
//         throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist")

//     }

// const isPasswordMatched = await bcryptjs.compare(password as string,isUserExist.password as string)

// if(!isPasswordMatched) {
//      throw new AppError(httpStatus.BAD_REQUEST, "incorrect password")
// }


// const userTokens = createUserTokens(isUserExist)


// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const {password:pass,...rest} = isUserExist.toObject();

// return {
//     accessToken:userTokens.accessToken,
//     refreshToken:userTokens.refreshToken,
//     user:rest
// }


// }


const getNewAccessToken = async (refreshToken:string) => {

    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)


return {
      accessToken:newAccessToken
}


}

const changePassword = async (oldPassword:string, newPassword:string, decodedToken:JwtPayload) => {

    const user = await User.findById(decodedToken.userId)

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword,user?.password as string)

    if(!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED,"old password does not match")
    }

user!.password = await bcryptjs.hash(newPassword,Number(envVars.BCRYPT_SALE_ROUND))

user!.save()

}
const setPassword = async (userId:string,plainPassword:string) =>{
    
    const user = await User.findById(userId)

    if(!user) {
        throw new AppError(404,"user not found")
    }

if(user.password && user.auths.some(auth => auth.provider="google")) {
throw new AppError(httpStatus.BAD_REQUEST,"you have already set your password. update the password from your profile")
}

const hashedPassword = await bcryptjs.hash(plainPassword,Number(envVars.BCRYPT_SALE_ROUND))

const credentialsLogin:IAuthProvider = {
    provider:"credentials",
    providerId:user.email
}

const auths:IAuthProvider[] = [...user.auths,credentialsLogin]

user.password= hashedPassword

user.auths = auths

await user.save()



}
const resetPassword = async (oldPassword:string, newPassword:string, decodedToken:JwtPayload) => {

    const user = await User.findById(decodedToken.userId)

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword,user?.password as string)

    if(!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED,"old password does not match")
    }

user!.password = await bcryptjs.hash(newPassword,Number(envVars.BCRYPT_SALE_ROUND))

user!.save()

}


export const AuthServices = {
    // credentialsLogin,
    getNewAccessToken,
    resetPassword,
    setPassword,
    changePassword,

}