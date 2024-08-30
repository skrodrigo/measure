import express from 'express';
import { measureRoutes } from './routes'; // Importa o roteador de forma flexível

const app = express();
app.use(express.json());

// Usa as rotas definidas
app.use('/api', measureRoutes);

export { app };
