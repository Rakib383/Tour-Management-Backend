/* eslint-disable @typescript-eslint/no-explicit-any */

import { Booking } from "../booking/booking.model";
import { Payment } from "./payment.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { BOOKING_STATUS } from "../booking/booking.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes"
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";




const initPayment = async (bookingId:string) => {

   const payment = await Payment.findOne({booking:bookingId})

   if(!payment) {
    throw new AppError(httpStatus.NOT_FOUND,"you have not booked this tour")
   }

   const booking = await Booking.findById(payment.booking)

   
   
           const address = (booking?.user as any).address
           const email = (booking?.user as any).email
           const phoneNumber = (booking?.user as any).phone
           const name = (booking?.user as any).name
   
           const sslPayload :ISSLCommerz = {
               address,
               email,
               phoneNumber,
               name,
               amount:payment.amount,
               transactionId:payment.transactionId
           }
   
   const sslPayment = await SSLService.sslPaymentInit(sslPayload)
   
          
   
           return {
               paymentURL:sslPayment.GatewayPageURL,
           }

}


const successPayment = async (query: Record<string, string>) => {

    const session = await Booking.startSession()
    session.startTransaction()

    try {

        const updatedPayment = await Payment.findOneAndUpdate( {transactionId:query.transactionId}, {
            status: PAYMENT_STATUS.PAID
        }, { new: true, runValidators: true, session })


         await Booking.findByIdAndUpdate(updatedPayment?.booking, {
            status: BOOKING_STATUS.COMPLETE
        }, { new: true, runValidators: true, session })


        await session.commitTransaction()

        session.endSession()

        return {success:true,message:"payment completed successfully"}



    } catch (error) {

        await session.abortTransaction()

        session.endSession()

        throw error

    }

}

const failPayment = async (query: Record<string, string>) => {

    const session = await Booking.startSession()
    session.startTransaction()

    try {

        const updatedPayment = await Payment.findOneAndUpdate( {transactionId:query.transactionId}, {
            status: PAYMENT_STATUS.FAILED
        }, { new: true, runValidators: true, session })


         await Booking.findByIdAndUpdate(updatedPayment?.booking, {
            status: BOOKING_STATUS.FAILED
        }, { new: true, runValidators: true, session })


        await session.commitTransaction()

        session.endSession()

        return {success:false,message:"payment failed"}



    } catch (error) {

        await session.abortTransaction()

        session.endSession()

        throw error

    }

}

const cancelPayment = async (query: Record<string, string>) => {

    const session = await Booking.startSession()
    session.startTransaction()

    try {

        const updatedPayment = await Payment.findOneAndUpdate( {transactionId:query.transactionId}, {
            status: PAYMENT_STATUS.CANCELLED
        }, { new: true, runValidators: true, session })


         await Booking.findByIdAndUpdate(updatedPayment?.booking, {
            status: BOOKING_STATUS.CANCEL
        }, { new: true, runValidators: true, session })


        await session.commitTransaction()

        session.endSession()

        return {success:false,message:"payment cancelled"}



    } catch (error) {

        await session.abortTransaction()

        session.endSession()

        throw error

    }

}


export const paymentService = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment
}