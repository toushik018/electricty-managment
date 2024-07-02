"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const admin_controller_1 = require("../admin/admin.controller");
const router = express_1.default.Router();
router.get('/me', (0, auth_1.default)('admin', 'consumer'), admin_controller_1.AdminController.getLoggedInUser);
exports.ProfileRoutes = router;
