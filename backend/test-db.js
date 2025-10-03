// teste-db.js
import pg from 'pg';
import 'dotenv/config';

// Pegamos a mesma URL de conexão que o Prisma usa
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	console.error('ERRO: A variável DATABASE_URL não foi encontrada no arquivo .env');
	process.exit(1);
}

console.log('Tentando conectar ao banco de dados PostgreSQL...');
console.log(`Usando a string de conexão: ${connectionString}`);

const { Client } = pg;
const client = new Client({
	connectionString: connectionString,
});

async function testConnection() {
	try {
		// 1. Tenta se conectar
		await client.connect();
		console.log('✅ CONEXÃO BEM-SUCEDIDA!');

		// 2. Executa uma query simples para confirmar
		const res = await client.query('SELECT NOW()');
		console.log('Resposta do banco de dados:', res.rows[0]);
	} catch (err) {
		// 3. Se houver um erro, exibe a mensagem
		console.error('❌ FALHA NA CONEXÃO!');
		console.error('O erro foi:', err.message);
		if (err.code === '28P01') {
			console.error('--> Código de erro 28P01 significa "authentication failed". O problema está nas credenciais ou no banco de dados.');
		}
	} finally {
		// 4. Fecha a conexão
		await client.end();
		console.log('Conexão fechada.');
	}
}

testConnection();
