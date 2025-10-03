import { Router } from 'express';
import ListAbandonedCartsController from './controllers/ListAbandonedCartsController.js';
import MailListAbandonedCartsController from './controllers/MailListAbandonedCartsController.js';

const cartsRoutes = Router();

const listAbandonedCartsController = new ListAbandonedCartsController();
const mailListAbandonedCartsController = new MailListAbandonedCartsController();

cartsRoutes.get('/abandoned', listAbandonedCartsController.handle);
cartsRoutes.get('/abandoned/mails', mailListAbandonedCartsController.handle);

export default cartsRoutes;
