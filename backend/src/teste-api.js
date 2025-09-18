import ISetApiProvider from './shared/providers/ApiProvider/implementations/IsetApiProvider.js';

(async () => {
	console.log('Iniciando teste de busca de carrinhos abandonados...');

	const iSetProvider = new ISetApiProvider();

	const now = new Date();
	const threeHourAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
	const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

	const abandonedCarts = await iSetProvider.getAbandonedCarts(threeHourAgo, twoHoursAgo);

	if (abandonedCarts.length > 0) {
		console.log('Conexão bem-sucedida!');
		console.log(`Total de carrinhos abandonados encontrados: ${abandonedCarts.length}`);
		console.log('Carrinhos abandonados');
		abandonedCarts.forEach((cart) => console.log(cart.orderId));
		console.log('Cliente do primeiro carrinho:', abandonedCarts[0].customer);
	} else {
		console.log('A conexão funcionou, mas nenhum carrinho abandonado foi encontrado na janela de tempo especificada.');
	}
})();
