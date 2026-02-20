import express from "express"
import { paymentController } from "./payment.controller";

export  const paymentRoutes = express.Router();

paymentRoutes.post("/init-payment/:bookingId",paymentController.initPayment)
paymentRoutes.post("/success",paymentController.successPayment)
paymentRoutes.post("/fail", paymentController.failPayment)
paymentRoutes.post("/cancel",paymentController.cancelPayment)