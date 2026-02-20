import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { envVars } from "../../../config/env";
import { sendResponse } from "../../utils/sendResponse";


const initPayment = catchAsync(async (req:Request,res:Response) => {

    const bookingId = req.params.bookingId;

    const result = await paymentService.initPayment(bookingId as string)

    sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "payment done successfully",
            data: result,
        });
})

const successPayment = catchAsync(async (req:Request,res:Response) => {

    const query = req.query

    const result = await paymentService.successPayment(query as Record<string,string>)

    if(result.success) {
        res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&message=${result.message}&status=${query.status}`)
    }
})

const failPayment = catchAsync(async (req:Request,res:Response) => {
    
     const query = req.query

    const result = await paymentService.failPayment(query as Record<string,string>)

    if(!result.success) {
        res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&message=${result.message}&status=${query.status}`)
    }

})

const cancelPayment = catchAsync(async (req:Request,res:Response) => {
     const query = req.query

    const result = await paymentService.cancelPayment(query as Record<string,string>)

    if(!result.success) {
        res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&message=${result.message}&status=${query.status}`)
    }
})
 

export const paymentController = {
    successPayment,
    cancelPayment,
    failPayment,
    initPayment
}