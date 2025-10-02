import ISetApiProvider from '../../../../shared/providers/ApiProvider/implementations/IsetApiProvider.js';

class ListAbandonedCartsUseCase {
	constructor(from, to) {
		this.ISetApiProvider = new ISetApiProvider();
		this.from = from;
		this.to = to;
	}

	async execute() {
		console.log('Use Case: Executando busca por carrinhos abandonados...');

		const abandonedCarts = await this.ISetApiProvider.getAbandonedCarts(this.from, this.to);
		return abandonedCarts;
	}
}

export default ListAbandonedCartsUseCase;
