/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as googleStrategy } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../app/modules/user/user.model";
import { Role } from "../app/modules/user/user.interface";
import { Strategy as localStrategy } from "passport-local";
import bcryptjs from "bcryptjs"

passport.use(new localStrategy({
    usernameField: "email",
    passwordField: "password"
}, async (email, password, done) => {

    try {

        const isUserExist = await User.findOne({ email })
        if (!isUserExist) {
            return done("user does not exist")

        }

        const isGoogleAuthenticated = isUserExist.auths.some(providerObject => providerObject.provider == "google")

        if(isGoogleAuthenticated && !isUserExist.password) {
            return done("you have authenticated through google, if you want to login with credentials,then at first login with google and set a password in profile. then you will be able to login with email & password.")
        }

        const isPasswordMatched = await bcryptjs.compare(password, isUserExist.password as string)

        if (!isPasswordMatched) {

            return done("password does not match")
        }

        return done(null, isUserExist)

    }
    catch (error) {
done(error)
    }

}))



passport.use(
    new googleStrategy({
        clientID: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        callbackURL: envVars.GOOGLE_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {

        try {

            const email = profile.emails?.[0]?.value;

            if (!email) {
                return done(null, false, { message: "no email found" })
            }

            let user = await User.findOne({ email })

            if (!user) {
                user = await User.create({
                    email,
                    name: profile.displayName,
                    picture: profile.photos?.[0]?.value,
                    role: Role.USER,
                    isVerified: true,
                    auths: [
                        {
                            provider: "google",
                            providerId: profile.id
                        }
                    ]

                })
            }

            return done(null, user)

        } catch (error) {

            console.log("google strategy error", error);
            return done(error)

        }

    })
)

passport.serializeUser((user: any, done) => {

    done(null, user._id)
})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.log(error);
        done(error)

    }
})