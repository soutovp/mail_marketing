import ISetApiProvider from './shared/providers/ApiProvider/implementations/IsetApiProvider.js';

(async () => {
	console.log('Iniciando teste de conexão com a API da iSet...');

	const iSetProvider = new ISetApiProvider();
	const data = await iSetProvider.getProducts('rt00011');
	if (data.productsFound > 0) {
		console.log('Conexão bem-sucedida!');
		console.log(`Total de produtos encontrados: ${data.productsFound}`);
		console.log('Amostra do primeiro produto:', data.products[0]);
	} else {
		console.log('A conexão funcionou, mas nenhum produto foi retornado ou ocorreu um erro.');
	}
})();
