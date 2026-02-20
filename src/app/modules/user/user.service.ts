/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface"
import { User } from "./user.model"
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs"
import { envVars } from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {

    const { email,password, ...rest } = payload;

    
    const isUserExist = await User.findOne({ email })

    // if (isUserExist) {
    //     throw new AppError(httpStatus.BAD_REQUEST, "User already exist")
    // }

    const hashedPassword = await bcryptjs.hash(password as string,Number(envVars.BCRYPT_SALE_ROUND))

    const authProvider: IAuthProvider = { provider: "credentials", providerId: "email" }

    const user = await User.create({
        email, password:hashedPassword, auths: [authProvider],
        ...rest
    })

    return user
}


const getAllUsers = async () => {
    const users = await User.find({});

    return users
}


const updateUser = async (userId:string,payload:Partial<IUser>,decodedToken:JwtPayload) => {

    const isUserExist = await User.findById(userId)


    if(!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND,"user not found")
    }




    if(payload.role) {

        if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN,"you are not authorized")
        }
        
    }

    if(payload.isActive || payload.isDeleted || payload.isVerified) {
        if( decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN,"you are not authorized")

        }
    }

    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password,Number(envVars.BCRYPT_SALE_ROUND))
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId,payload,{new:true,runValidators:true})


return newUpdatedUser;
    
}


export const UserServices = {
    createUser,
    getAllUsers,
    updateUser
}