import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import adminRoutes from "./routes/admin.route.js"

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use("/", adminRoutes)

export default app
