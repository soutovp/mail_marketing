import { Router } from 'express';
import ListAbandonedCartsController from './controllers/ListAbandonedCartsController.js';

const cartsRoutes = Router();

const listAbandonedCartsController = new ListAbandonedCartsController();

cartsRoutes.get('/abandoned', listAbandonedCartsController.handle);

export default cartsRoutes;
