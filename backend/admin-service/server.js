import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import { connectDB } from "./src/db/db.js";

const PORT = process.env.PORT || 3002;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Admin Service is running on port ${PORT}`);
    });
}).catch((err) => {
    console.log("Error while starting server:", err);
});
