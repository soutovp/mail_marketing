import ISetApiProvider from './shared/providers/ApiProvider/implementations/IsetApiProvider.js';
// Passo 1: Use a sintaxe de 'import' para carregar as bibliotecas
import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

(async () => {
	console.log('Iniciando teste de busca de carrinhos abandonados...');

	const iSetProvider = new ISetApiProvider();

	const now = new Date();
	const threeHourAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
	const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

	const abandonedCarts = await iSetProvider.getAbandonedCarts(threeHourAgo, twoHoursAgo);

	if (abandonedCarts.length > 0) {
		const arr = [];

		abandonedCarts.forEach((carts) => {
			arr.push({
				customer_order: carts.orderId,
				customer_pedidoManual: carts.origin,
				customer_datePurchased: carts.datePurchased,
				customer_state: carts.shipping.address.state,
				customer_city: carts.shipping.address.city,
				customer_name: carts.customer.name,
				customer_email: carts.customer.email,
				customer_phone_one: `${carts.customer.phones.primary.ddd} ${carts.customer.phones.primary.number}`,
			});
		});

		// 2. Criar um novo "workbook" (o arquivo Excel em si)
		const worksheet = xlsx.utils.json_to_sheet(arr);
		const workbook = xlsx.utils.book_new();
		xlsx.utils.book_append_sheet(workbook, worksheet, 'Carrinhos Abandonados');

		// 4. Definir o caminho de saída (a forma correta para ES Modules)
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);
		const outputDir = path.join(__dirname, 'relatorios'); // Salvará na pasta 'relatorios'
		const filePath = path.join(outputDir, 'carrinhos_abandonados.xlsx');

		// 5. (Opcional, mas recomendado) Verificar se o diretório existe. Se não, criá-lo.
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		// 6. Escrever o arquivo no disco
		xlsx.writeFile(workbook, filePath);

		// console.log(`Planilha gerada com sucesso em: ${filePath}`);
		// console.log('Conexão bem-sucedida!');
		// console.log(`Total de carrinhos abandonados encontrados: ${abandonedCarts.length}`);
		// console.log('Carrinhos abandonados');
		// abandonedCarts.forEach((cart) =>
		// 	console.log(
		// 		`Pedido: ${cart.orderId} | Status: ${cart.statusId} | Last Modified: ${cart.lastModified} | Pedido Manual/Online: ${cart.origin} ${
		// 			cart.payment.method ? '| Payment: ' + cart.payment.method + ' / ' + cart.payment.title : ''
		// 		}`
		// 	)
		// );
		// console.log('Primeiro Carrinho:', abandonedCarts[0]);
	} else {
		console.log('A conexão funcionou, mas nenhum carrinho abandonado foi encontrado na janela de tempo especificada.');
	}
})();
