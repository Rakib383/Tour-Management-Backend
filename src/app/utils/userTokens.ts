import { envVars } from "../../config/env"
import { IUser } from "../modules/user/user.interface"
import { generateToken } from "./jwt"

export const createUserTokens = (user:Partial<IUser>)=> {
    const JwtPayload = {
    userId: user._id,
    email:user.email,
    role:user.role
}

const accessToken = generateToken(JwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)
const refreshToken = generateToken(JwtPayload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_EXPIRES)


return {
    accessToken,refreshToken
}


}