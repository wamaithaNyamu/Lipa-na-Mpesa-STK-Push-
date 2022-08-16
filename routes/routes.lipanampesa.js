import express from 'express'
const router = express.Router()
import {
    initiateSTKPush,
    stkPushCallback,
    confirmPayment


} from "../controllers/controllers.lipanampesa.js";


import {access} from "../middlewares/middlewares.generateAccessToken.js";

router.route('/stkPush').post(access,initiateSTKPush)
router.route('/stkPushCallback/:Order_ID').post(stkPushCallback)
router.route('/confirmPayment/:CheckoutRequestID').post(access,confirmPayment)

export default router