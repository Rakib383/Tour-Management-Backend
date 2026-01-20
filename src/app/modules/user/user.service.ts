/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface"
import { User } from "./user.model"
import httpStatus from "http-status-codes";

const createUser = async (payload: Partial<IUser>) => {

    const { email, ...rest } = payload;

    
    const isUserExist = await User.findOne({ email:email! })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exist")
    }

    const authProvider: IAuthProvider = { provider: "credentials", providerId: "email" }

    const user = await User.create({
        email, auths: [authProvider],
        ...rest
    })

    return user
}


const getAllUsers = async () => {
    const users = await User.find({});

    return users
}


export const UserServices = {
    createUser,
    getAllUsers
}