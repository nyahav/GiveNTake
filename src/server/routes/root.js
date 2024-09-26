import { Router } from 'express';
const router = Router();
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(join(__dirname, '..', 'views', 'index.html'));
});

export default router;