import ISetApiProvider from './shared/providers/ApiProvider/implementations/IsetApiProvider.js';

(async () => {
	console.log('Iniciando teste de conexão com a API da iSet...');

	const iSetProvider = new ISetApiProvider();
	const products = await iSetProvider.getProducts('rt00011');

	if (products.length > 0) {
		console.log('Conexão bem-sucedida!');
		console.log(`Total de produtos encontrados: ${products.length}`);
		console.log('Amostra do primeiro produto:', products[0]);
	} else {
		console.log('A conexão funcionou, mas nenhum produto foi retornado ou ocorreu um erro.');
	}
})();
