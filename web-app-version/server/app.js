import express from 'express';
import cors from 'cors';
import elevatorRoutes from './routes/elevator.route.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount elevator routes
app.use('/elevator', elevatorRoutes);

app.use(errorMiddleware);

export default app;
