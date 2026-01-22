

import 'dotenv/config'


interface EnvConfig {
     PORT: string,
    DB_URL: string,
    NODE_ENV: "development" | "production",
    BCRYPT_SALE_ROUND:string,
    JWT_ACCESS_EXPIRES:string,
    JWT_ACCESS_SECRET:string,
    JWT_REFRESH_EXPIRES:string,
    JWT_REFRESH_SECRET:string,
    SUPER_ADMIN_EMAIL:string,
    SUPER_ADMIN_PASSWORD:string
}

const loadEnvVariables = ():EnvConfig => {

    const requiredEnvVariables:string[] = ["PORT","DB_URL","NODE_ENV","BCRYPT_SALE_ROUND","JWT_ACCESS_EXPIRES","JWT_ACCESS_SECRET","SUPER_ADMIN_EMAIL","SUPER_ADMIN_PASSWORD","JWT_REFRESH_EXPIRES","JWT_REFRESH_SECRET"]

requiredEnvVariables.forEach(key => {
    if(!process.env[key]) {
        throw new Error (`missing required env variable ${key}`)
    }
})

return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    BCRYPT_SALE_ROUND:process.env.BCRYPT_SALE_ROUND as string,
    JWT_ACCESS_EXPIRES:process.env.JWT_ACCESS_EXPIRES as string,
    JWT_ACCESS_SECRET:process.env.JWT_ACCESS_SECRET as string,
    SUPER_ADMIN_PASSWORD:process.env.SUPER_ADMIN_PASSWORD as string,
    SUPER_ADMIN_EMAIL:process.env.SUPER_ADMIN_EMAIL as string,
    JWT_REFRESH_EXPIRES:process.env.JWT_REFRESH_EXPIRES as string,
    JWT_REFRESH_SECRET:process.env.JWT_REFRESH_SECRET as string
}

    
}

export const envVars = loadEnvVariables()