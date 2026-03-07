/* eslint-disable @typescript-eslint/no-explicit-any */

import { Booking } from "../booking/booking.model";
import { Payment } from "./payment.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { BOOKING_STATUS } from "../booking/booking.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes"
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { generatePdf, IInvoiceData } from "../../utils/invoice";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
import { sendEmail } from "../../utils/sendEmail";




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

         if(!updatedPayment) {
            throw new AppError(404,"booking error occurred")
        }

         const updatedBooking = await Booking.findByIdAndUpdate(updatedPayment?.booking, {
            status: BOOKING_STATUS.COMPLETE
        }, { new: true, runValidators: true, session })
        .populate("tour","title")
        .populate("user","name email")
        

        if(!updatedBooking) {
            throw new AppError(404,"booking error occured")
        }

        const invoiceData :IInvoiceData = {
            bookingDate:updatedBooking.createdAt as Date,
            transactionId:updatedPayment?.transactionId,
            guestCount:updatedBooking?.guestCount,
            totalAmount:updatedPayment?.amount,
            tourTitle:(updatedBooking.tour as unknown as ITour).title,
            userName:(updatedBooking.user as unknown as IUser).name

        }

        const pdfBuffer = await generatePdf(invoiceData)

        await sendEmail({
            to:(updatedBooking.user as unknown as IUser).email,
            subject:"your booking invoice",
            templateName:"invoice",
            templateData:invoiceData,
            attachments:[
                {
                    filename:"invoice.pdf",
                    content:pdfBuffer,
                    contentType:"application/pdf"
                }
            ]

        })

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