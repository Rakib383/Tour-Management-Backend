import { Request, Response } from "express";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import { UserServices } from "./user.service";

const createUser = async (req:Request,res:Response) => {
   try {
    
    const user = await UserServices.createUser(req.body)

    res.status(httpStatus.CREATED).json({
        message:"user created successfully",
        user
    })

   } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({
        message:`something wrong ${error}`,
        
    })
    
   }
}

export const UserControllers = {
    createUser
}