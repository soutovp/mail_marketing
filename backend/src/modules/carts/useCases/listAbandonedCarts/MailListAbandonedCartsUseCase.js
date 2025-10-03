import ISetApiProvider from '../../../../shared/providers/ApiProvider/implementations/IsetApiProvider.js';
import parseDate from './parseDateFunction.js';

class MailListAbandonedCartsUseCase {
	constructor() {
		this.ISetApiProvider = new ISetApiProvider();
	}

	async execute({ from, to }) {
		console.log(`Use Case: Recebeu as datas ( brutas ): from=${from}, to=${to}`);

		const now = new Date();

		const startDate = parseDate(from);
		const endDate = parseDate(to);

		const finalStartDate = startDate || new Date(new Date().setDate(now.getDate() - 30));
		const finalEndDate = endDate || now;

		console.log(`Use Case: Datas processadas from=${finalStartDate.toISOString()}, to=${finalEndDate.toISOString()}`);

		const abandonedCarts = await this.ISetApiProvider.getAbandonedCarts(finalStartDate, finalEndDate);

		const mailList = [];
		abandonedCarts.forEach((cart) => {
			mailList.push({
				customer: cart.customer.name || '',
				company: cart.customer.company || '',
				mail: cart.customer.email || '',
			});
		});
		return mailList;
	}
}

export default MailListAbandonedCartsUseCase;
