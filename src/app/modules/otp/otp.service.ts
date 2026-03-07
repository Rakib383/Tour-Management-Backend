import crypto from "crypto";
import { redisClient } from "../../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
const OTP_EXPIRATION = 2*60 




const generateOtp = (length=6) => {

    const otp = crypto.randomInt(10 ** (length-1),1000000).toString()

    return otp

}



export const sendOTP = async( email:string,name:string)=> {
     const user = await User.findOne({email})

    if(!user) {
        throw new AppError(401,"user not found")
    }

    if(user.isVerified) {
        throw new AppError(401,"you are already verified")
    }
    const otp = generateOtp();

    const redisKey = `otp:${email}`

    await redisClient.set(redisKey,otp,{
        expiration:{
            type:"EX",
            value:OTP_EXPIRATION
        }
    })

    await sendEmail({
        to:email,
        subject:"your otp code",
        templateName:"otp",
        templateData:{
            name,
            otp
        }
    })

   
}

export const verifyOTP = async (email:string,otp:string) => {

    const user = await User.findOne({email})

    if(!user) {
        throw new AppError(401,"user not found")
    }

    if(user.isVerified) {
        throw new AppError(401,"you are already verified")
    }

        const redisKey = `otp:${email}`

        const savedOtp = await redisClient.get(redisKey)

        if(!savedOtp) {
            throw new AppError(401,"invalid otp")
        }

        if(savedOtp !== otp) {
             throw new AppError(401,"invalid otp")
        }


        await Promise.all([
User.updateOne({email},{isVerified:true},{runValidators:true}),
redisClient.del([redisKey])
        ])
}

export const OTPServices = {
    sendOTP,
    verifyOTP
}