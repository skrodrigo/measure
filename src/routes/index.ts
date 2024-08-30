import { Router } from 'express';
import { uploadMeasure } from '../controllers/measureController';

const router = Router();

// Define as rotas disponíveis
router.post('/upload', uploadMeasure);

// Exporta o router
export { router as measureRoutes };
