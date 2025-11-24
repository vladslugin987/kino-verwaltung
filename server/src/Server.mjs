import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.argv[2] || 8080;

// Serve static files from webapp/dist
const distPath = path.join(__dirname, '../../webapp/dist');
app.use(express.static(distPath));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
