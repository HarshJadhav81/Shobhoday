import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from './middlewares/errorHandler';
import { AppError } from './utils/AppError';
import { logger } from './utils/logger';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import routes from './routes/index';

const app = express();

// 1. GLOBAL MIDDLEWARES

// Security HTTP headers
app.use(helmet());

app.use(
  cors({
    origin: env.NODE_ENV === 'production' 
      ? 'https://yourdomain.com' 
      : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  })
);

// Development logging
if (env.NODE_ENV === 'development') {
  app.use(
    morgan('dev', {
      stream: { write: (message) => logger.http(message.trim()) },
    })
  );
}

// Rate limiting
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per windowMs
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again in 15 minutes!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Fix for Express 5: req.query is a getter, but legacy middlewares try to reassign it
app.use((req: Request, res: Response, next: NextFunction) => {
  const query = { ...req.query };
  Object.defineProperty(req, 'query', {
    value: query,
    writable: true,
  });
  next();
});

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'price',
      'rating',
      'category',
      'size',
      'color',
    ],
  })
);

// Compress responses
app.use(compression());

// 2. ROUTES
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

app.get('/api/v1/status', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API is running smoothly.',
    environment: env.NODE_ENV,
    version: '1.0.0',
  });
});

app.use('/api', routes);

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Unhandled routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 3. GLOBAL ERROR HANDLER
app.use(errorHandler);

export default app;
