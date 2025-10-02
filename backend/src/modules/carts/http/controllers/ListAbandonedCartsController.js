import ListAbandonedCartsUseCase from '../../useCases/listAbandonedCarts/ListAbandonedCartsUseCase.js';
class ListAbandonedCartsController {
	async handle(request, response) {
		console.log(converterDataParaMilissegundos(request.query.from));
		console.log(request.query.to);
		const now = new Date();
		const time = {
			from: converterDataParaMilissegundos(request.query.from) || new Date(now.getTime() - 25 * 60 * 60 * 1000),
			to: converterDataParaMilissegundos(request.query.to) || new Date(now.getTime() - 24 * 60 * 60 * 1000),
		};
		console.log(`Pegando data de ${request.query.from} ~ ${request.query.to}`);
		console.log(time);
		try {
			//1. Instancia o caso de uso
			const listAbandonedCartsUseCase = new ListAbandonedCartsUseCase(time.from, time.to);

			//2. Execuuta a lógica de negócio
			const abandonedCarts = await listAbandonedCartsUseCase.execute();

			//3. Retorna a resposta para o cliente
			return response.status(200).json(abandonedCarts);
		} catch (error) {
			console.error('Erro no controller:', error);
			return response.status(500).json({ error: 'Internal server error' });
		}
	}
}
function converterDataParaMilissegundos(dataString) {
	const partes = dataString.split('-');
	const dia = parseInt(partes[0], 10);
	const mes = parseInt(partes[1], 10) - 1; // O mês em JavaScript é baseado em zero (0-11)
	const ano = parseInt(partes[2], 10);

	// Cria um novo objeto Date com os componentes da data
	const data = new Date(ano, mes, dia);
	// Retorna o timestamp em milissegundos
	return data.getTime();
}
export default ListAbandonedCartsController;
