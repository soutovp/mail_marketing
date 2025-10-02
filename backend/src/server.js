import app from './shared/infra/http/app.js';
const port = 3002;

app.listen(port, () => {
	console.log(`Listenning to port ${port}\n at http://127.0.0.1:${port}`);
});
