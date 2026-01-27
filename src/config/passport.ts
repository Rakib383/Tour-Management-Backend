/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as googleStrategy, Profile } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../app/modules/user/user.model";
import { Role } from "../app/modules/user/user.interface";



passport.use(
    new googleStrategy({
        clientID:envVars.GOOGLE_CLIENT_ID,
        clientSecret:envVars.GOOGLE_CLIENT_SECRET,
        callbackURL:envVars.GOOGLE_CALLBACK_URL
    }, async (accessToken,refreshToken,profile,done) => {

        try {
            
            const email = profile.emails?.[0]?.value;

            if(!email) {
                return done(null,false,{message:"no email found"})
            }

            let user = await User.findOne({email})

            if(!user) {
                user = await User.create({
                    email,
                    name:profile.displayName,
                    picture:profile.photos?.[0]?.value,
                    role:Role.USER,
                    isVerified:true,
                    auths:[
                        {
                            provider:"google",
                            providerId:profile.id
                        }
                    ]

                })
            }

            return done(null,user)

        } catch (error) {

            console.log("google strategy error", error);
            return done(error)
            
        }

    })
)

passport.serializeUser((user:any, done) => {

    done(null,user._id)
})

passport.deserializeUser(async (id:string, done:any) => {
    try {
        const user = await User.findById(id);
        done(null,user);
    } catch (error) {
        console.log(error);
        done(error)
        
    }
})