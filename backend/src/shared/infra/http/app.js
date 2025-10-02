import express from 'express';
import cartsRoutes from '../../../modules/carts/http/carts.routes.js';
// const app = express();

class App {
	constructor() {
		this.server = express();
		this.middlewares();
		this.routes();
	}
	middlewares() {
		this.server.use(express.json());
	}

	routes() {
		this.server.use('/carts', cartsRoutes);
	}
}

export default new App().server;
