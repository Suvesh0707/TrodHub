import express from "express"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(cookieParser())

import userRoutes from "./routes/user.route.js"
app.use("/", userRoutes)

export default  app