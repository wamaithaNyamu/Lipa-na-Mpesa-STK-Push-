import request from "request";
import {getTimestamp} from "../Utils/utils.timestamp.js";


// @desc initiate stk push
// @method POST
// @route /stkPush
// @access public
export const initiateSTKPush = async(req, res) => {
    try{

        // const createLipaNaMpesaRecords= await LipaNaMpesaModel.create(req.body)
        const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        const auth = "Bearer " + req.safaricom_access_token

        const timestamp = getTimestamp()
        //shortcode + passkey + timestamp
        const password = new Buffer.from(process.env.SAFARICOM_SHORT_CODE + process.env.SAFARICOM_PASS_KEY + timestamp).toString('base64')
        console.log(`${process.env.SAFARICOM_CALLBACK_URL}/${req.body.Order_ID}`)
        request(
            {
                url: url,
                method: "POST",
                headers: {
                    "Authorization": auth
                },
                json: {
                    "BusinessShortCode": process.env.BUSINESS_SHORT_CODE,
                    "Password": password,
                    "Timestamp": timestamp,
                    "TransactionType": "CustomerPayBillOnline",
                    "Amount": "1",
                    "PartyA": req.body.phone,
                    "PartyB": process.env.BUSINESS_SHORT_CODE,
                    "PhoneNumber": req.body.phone,
                    "CallBackURL": `${process.env.SAFARICOM_CALLBACK_URL}/${req.body.Order_ID}`,
                    "AccountReference": "Wamaitha Online Shop",
                    "TransactionDesc": "Paid online"
                }
            },
            function (error, response, body) {
                if (error) {
                    console.log(error)
                } else {
                    res.status(200).json(body)
                }
            }
        )
    }catch (e) {
        console.error("Error while trying to create LipaNaMpesa details",e)
        res.status(503).send({
            message:"Something went wrong while trying to create LipaNaMpesa details. Contact admin",
            error : e
        })
    }
}

// @desc callback route Safaricom will post transaction status
// @method POST
// @route /stkPushCallback/:Order_ID
// @access public
export const stkPushCallback = async(req, res) => {
    try{

        const host = req.get('host');

        if(host === process.env.SERVER_HOST){
            console.log("*".repeat(40))
            console.log("Request origin callback")
            console.log(host)
            console.log("Body from mpesa" , req.body , req.params)
            const meta = await req.body.Body.stkCallback
            const a = meta.CallbackMetadata
            const ab = Object.values(a.Item)
            const obj = ab.find(o=> o.Name === 'PhoneNumber')
            const phone = obj.Value

            res.json("LipaNaMpesaDetails")
        }else{
            res.status(503).send({
                message:"Something went wrong while trying to update the LipaNaMpesa record. Contact admin",

            })
        }

    }catch (e) {
        console.error("Error while trying to update LipaNaMpesa details",e)
        res.status(503).send({
            message:"Something went wrong while trying to update the LipaNaMpesa record. Contact admin",
            error : e.message
        })
    }
}

// @desc Check from safaricom servers the status of a transaction
// @method GET
// @route /confirmPayment/:CheckoutRequestID
// @access public
export const confirmPayment = async(req, res) => {
    try{

        const url = "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query"
        const auth = "Bearer " + req.safaricom_access_token

        const timestamp = getTimestamp()
        //shortcode + passkey + timestamp
        const password = new Buffer.from(process.env.SAFARICOM_SHORT_CODE + process.env.SAFARICOM_PASS_KEY + timestamp).toString('base64')


        request(
            {
                url: url,
                method: "POST",
                headers: {
                    "Authorization": auth
                },
                json: {
                    "BusinessShortCode":process.env.BUSINESS_SHORT_CODE,
                    "Password": password,
                    "Timestamp": timestamp,
                    "CheckoutRequestID": req.params.CheckoutRequestID,

                }
            },
            function (error, response, body) {
                if (error) {
                    console.log(error)
                    res.status(503).send({
                        message:"Something went wrong while trying to create LipaNaMpesa details. Contact admin",
                        error : error
                    })
                } else {
                    res.status(200).json(body)
                }
            }
        )
    }catch (e) {
        console.error("Error while trying to create LipaNaMpesa details",e)
        res.status(503).send({
            message:"Something went wrong while trying to create LipaNaMpesa details. Contact admin",
            error : e
        })
    }
}

