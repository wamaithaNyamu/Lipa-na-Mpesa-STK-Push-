import express from "express";
import cors from "cors";
import 'dotenv/config'

// initialise exxpress
const app = express()

// express middleware that convert request body to JSON.
app.use(express.json())
app.use(cors())

// import routes
import lipaNaMpesaRoutes from "./routes/routes.lipanampesa.js"
app.use('/api',lipaNaMpesaRoutes)

const port = process.env.PORT
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})



