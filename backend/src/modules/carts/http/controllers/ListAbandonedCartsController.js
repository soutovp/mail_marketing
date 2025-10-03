import ListAbandonedCartsUseCase from '../../useCases/listAbandonedCarts/ListAbandonedCartsUseCase.js';
class ListAbandonedCartsController {
	async handle(request, response) {
		const { from, to } = request.query;
		try {
			//1. Instancia o caso de uso
			const listAbandonedCartsUseCase = new ListAbandonedCartsUseCase();

			//2. Execuuta a lógica de negócio
			const abandonedCarts = await listAbandonedCartsUseCase.execute({ from, to });

			//3. Retorna a resposta para o cliente
			return response.status(200).json(abandonedCarts);
		} catch (error) {
			console.error('Erro no controller:', error);
			return response.status(500).json({ error: 'Internal server error' });
		}
	}
}

export default ListAbandonedCartsController;
