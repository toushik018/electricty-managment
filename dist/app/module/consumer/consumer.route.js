"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const consumer_controller_1 = require("./consumer.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)('admin'), consumer_controller_1.ConsumerController.getConsumers);
router.get('/payment-status/:consumerId', (0, auth_1.default)(), consumer_controller_1.ConsumerController.checkPaymentStatus);
router.get('/monthly-bill', (0, auth_1.default)('consumer'), consumer_controller_1.ConsumerController.getConsumerMonthlyBill);
router.get('/me', (0, auth_1.default)('consumer'), consumer_controller_1.ConsumerController.getLoggedInConsumerDetails);
router.put('/update', (0, auth_1.default)(), consumer_controller_1.ConsumerController.updateConsumerDetails);
router.post('/change-password', (0, auth_1.default)('consumer'), consumer_controller_1.ConsumerController.changeConsumerPassword);
router.post('/register', (0, auth_1.default)('admin'), consumer_controller_1.ConsumerController.registerConsumer);
router.post('/add-consumption', (0, auth_1.default)("admin"), consumer_controller_1.ConsumerController.addConsumption);
router.post('/login', consumer_controller_1.ConsumerController.loginConsumer);
router.post("/pay-bill", (0, auth_1.default)(), consumer_controller_1.ConsumerController.payBill);
exports.ConsumerRoutes = router;