import MailListAbandonedCartsUseCase from '../../useCases/listAbandonedCarts/MailListAbandonedCartsUseCase.js';

class MailListAbandonedCartsController {
	async handle(req, res) {
		const { from, to } = req.query;
		try {
			const mailListAbandonedCartsUseCase = new MailListAbandonedCartsUseCase();
			const mailListAbandonedCarts = await mailListAbandonedCartsUseCase.execute({ from, to });

			return res.status(200).json(mailListAbandonedCarts);
		} catch (error) {
			console.error('Error no controller:', error);
			return response.status(500).json({ error: 'Internal server error.' });
		}
	}
}

export default MailListAbandonedCartsController;
