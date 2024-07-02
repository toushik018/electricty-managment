"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
router.get('/me', (0, auth_1.default)('admin'), admin_controller_1.AdminController.getLoggedInUser);
router.get('/stats', admin_controller_1.AdminController.getStats);
router.post('/register', admin_controller_1.AdminController.createAdmin);
router.post('/login', admin_controller_1.AdminController.loginAdmin);
exports.AdminRoutes = router;
