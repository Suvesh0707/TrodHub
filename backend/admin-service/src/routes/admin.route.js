import { createAccountByAdmin, banUser, unbanUser, getPlatformAnalytics, resolveDispute } from "../controllers/admin.controller.js";
import express from "express"
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router()

// Superadmin and Admin routes for account creation
router.post("/create", authenticate, authorize(["superadmin", "admin"]), createAccountByAdmin);

// Admin and Superadmin routes
router.put("/ban/:userId", authenticate, authorize(["admin", "superadmin"]), banUser);
router.put("/unban/:userId", authenticate, authorize(["admin", "superadmin"]), unbanUser);
router.get("/analytics", authenticate, authorize(["admin", "superadmin"]), getPlatformAnalytics);
router.post("/dispute/resolve", authenticate, authorize(["admin", "superadmin"]), resolveDispute);

export default router
