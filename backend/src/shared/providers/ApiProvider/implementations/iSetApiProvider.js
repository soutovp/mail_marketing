import axios from 'axios';
import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';

// Para que o __dirname funcione com módulos ES6, precisamos de um pequeno ajuste
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ISetApiProvider {
	constructor() {
		this.apiKey = process.env.ISET_API_KEY;
		this.apiUser = process.env.ISET_API_USER;
		this.baseURL = `${process.env.ISET_API_BASE_URL}/ws/v1`;
		this.tokenPath = path.resolve(__dirname, '..', '..', '..', '..', 'tmp', 'iset-token.json');
		if (!this.apiKey || !process.env.ISET_API_BASE_URL) {
			throw new Error('As variáveis ISET_API_KEY e ISET_BASE_URL precisam ser definidas no arquivo .env');
		}
		this.token = null;
		this.tokenExpiresAt = null;

		this.api = axios.create({
			baseURL: this.baseURL,
		});

		this.api.interceptors.request.use(async (config) => {
			if (config.url === '/oauth') {
				return config;
			}

			await this._loadTokenFromFile();
			if (!this.token || this.tokenExpiresAt < new Date()) {
				console.log('Token inválido ou expirado. Autenticando...');
				await this._authenticate();
			}
			config.headers.Authorization = `Bearer ${this.token}`;

			return config;
		});
	}
	/**
	 * Carrega o token do arquivo JSON, se ele existir e for válido.
	 */
	async _loadTokenFromFile() {
		// Se já temos um token válido na memória, não precisamos ler o arquivo de novo.
		if (this.token && this.tokenExpiresAt > new Date()) {
			console.log('vai retornar');
			return;
		}
		try {
			console.log(this.tokenPath);
			const fileContent = await fs.readFile(this.tokenPath, 'utf-8');
			const tokenData = JSON.parse(fileContent);
			// Verificamos se o token do arquivo ainda é válido
			if (new Date(tokenData.expiresAt) > new Date()) {
				this.token = tokenData.token;
				this.tokenExpiresAt = new Date(tokenData.expiresAt);
				console.log('Token carregado do arquivo com sucesso.');
			}
		} catch (error) {
			// Se o arquivo não existe (error.code === 'ENOENT'), é normal na primeira execução.
			if (error.code !== 'ENOENT') {
				console.error('Erro ao ler o arquivo de token:', error);
			}
			this.token = null; // Garante que o token seja nulo se o arquivo não existir ou for inválido
		}
	}
	/**
	 * Salva o token e a data de expiração em um arquivo JSON.
	 */
	async _saveTokenToFile() {
		const tokenData = {
			token: this.token,
			expiresAt: this.tokenExpiresAt,
		};

		try {
			// Garante que o diretório /tmp exista
			await fs.mkdir(path.dirname(this.tokenPath), { recursive: true });
			await fs.writeFile(this.tokenPath, JSON.stringify(tokenData, null, 2));
			console.log('Token salvo com sucesso em:', this.tokenPath);
		} catch (error) {
			console.error('Erro ao salvar o arquivo de token:', error);
		}
	}
	async _authenticate() {
		try {
			const basicAuth = btoa(`${this.apiUser}:${this.apiKey}`);
			const authResponse = await axios.post(
				`${this.baseURL}/oauth`,
				{},
				{
					headers: {
						Authorization: `Basic ${basicAuth}`,
					},
				}
			);
			console.log(authResponse);
			const { token, expires_in } = await authResponse.data;
			if (!token) {
				throw new Error('Falha na authenticação: token не recebido.');
			}
			this.token = token;
			const expiresInSeconds = expires_in - 60;
			this.tokenExpiresAt = new Date(new Date().getTime() + expiresInSeconds * 1000);

			console.log('Autenticado com sucesso! O token é válido até:', this.tokenExpiresAt.toLocaleTimeString('pt-BR'));

			await this._saveTokenToFile();
		} catch (error) {
			console.error('ERRO CRÍTICO: Falha ao autenticar na API da iSet.', error.response?.data || error.message);
			throw new Error('Não foi possível autenticar na API da iSet.');
		}
	}
	/**
	 * ALTERADO: Este método agora faz um POST para /product/search
	 * @param {string} term O termo para buscar. Um espaço em branco busca todos.
	 * @param {number} limit A quantidade de resultados.
	 * @returns {Promise<Array>} Uma promessa que resolve para um array de produtos.
	 */
	async getProducts(term = ' ', limit = 10) {
		try {
			console.log(`Buscando produtos na API da iSet com o termo: "${term}"`);
			const response = await this.api.post('/product/search', {
				query: term,
				limit: limit,
			});
			return response.data;
		} catch (e) {
			console.error('Erro ao buscar produtos:', e.response?.data || e.message);
			return [];
		}
	}
}

export default ISetApiProvider;
