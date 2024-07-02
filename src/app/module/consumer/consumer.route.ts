import express from 'express';
import { ConsumerController } from './consumer.controller';
import auth from '../../middleware/auth';


const router = express.Router();
router.get('/', auth('admin'), ConsumerController.getConsumers);
router.get('/payment-status/:consumerId', auth(), ConsumerController.checkPaymentStatus);

router.get('/monthly-bill', auth('consumer'), ConsumerController.getConsumerMonthlyBill);


router.get('/me', auth('consumer'), ConsumerController.getLoggedInConsumerDetails);

router.put('/update', auth(), ConsumerController.updateConsumerDetails);

router.post('/change-password', auth('consumer'), ConsumerController.changeConsumerPassword);

router.post('/register', auth('admin'), ConsumerController.registerConsumer);

router.post('/add-consumption', auth("admin"), ConsumerController.addConsumption);

router.post('/login', ConsumerController.loginConsumer);
router.post("/pay-bill", auth(), ConsumerController.payBill);

export const ConsumerRoutes = router;
