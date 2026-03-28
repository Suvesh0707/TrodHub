import express from "express";
import proxy from "express-http-proxy";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Proxy requests to the user-service
// For example, /api/v1/users will be proxied to http://localhost:3001/api/v1/users
app.use("/api/v1/users", proxy(process.env.USER_SERVICE_URL || "http://localhost:3001"));

app.get("/health", (req, res) => {
  res.json({ status: "API Gateway is running" });
});

app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
