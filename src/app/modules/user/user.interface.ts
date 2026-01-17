import { Types } from "mongoose";

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE"
}

export interface IAuthProvider {
    provider:string;
    providerId:string;
}

export interface IUser {
    name:string;
    email:string;
    password ?: string;
    phone?:string;
    picture?:string;
    address?:string;
    isDeleted?:boolean;
    isActive?:"ACTIVE"|"INACTIVE"|"BLOCKED";
    isVerified?:string;
    role: Role;
    auths:IAuthProvider[];
    Bookings?:Types.ObjectId[];
    guides?:Types.ObjectId[]

}