/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../../config/env"
import AppError from "../errorHelpers/AppError"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler = (err:any,req:Request,res:Response,next:NextFunction) => {
    let statusCode = 500
let message = "something went wrong"
const errorSources :any = []


 if(envVars.NODE_ENV === "development") {
            console.log(err);
        }

// duplicate error

    if(err.code === 11000) {
       
        const duplicate = err.message.match(/"([^"]*)"/)

        message=`${duplicate[1]} already exists !!`
    }



    // zoderror

    else if(err.name === "ZodError") {
        statusCode=400;
        message=" zod error"

        err.issues.forEach((issue:any) => {
errorSources.push({
    path:issue.path[issue.path.length-1],
    message:issue.message
})
        })

    }

    // mongoose casting error

    else if(err.name === "castError") {
        statusCode= 400;
        message="invalid mongodb objectId. please provide a valid id"
    }



    // mongoose validation error

    else if(err.name === "validationError") {
        statusCode= 400;
        const errors = Object.values(err.errors)
        
        errors.forEach((errorObject:any) => errorSources.push(
            {
                path:errorObject.path,
                message:errorObject.message
            }
        ))

        message="validation error occurred"
    }

   else if(err instanceof AppError) {
        statusCode = err.statusCode
    }

    res.status(statusCode).json({
        success:false,
        message:`${message}`,
        errorSources,
        err: envVars.NODE_ENV === "development" ? err : null,
        stack:envVars.NODE_ENV === "development" ? err.stack : null
    })
} 