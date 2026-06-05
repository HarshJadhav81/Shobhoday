import app from './app';
import { env } from './config/env';
import { connectDB } from './database/connection';
import { logger } from './utils/logger';

// Handle Uncaught Exceptions (Synchronous errors)
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message, err.stack);
  process.exit(1);
});

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Start Server
  const server = app.listen(env.PORT, () => {
    logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });

  // Handle Unhandled Rejections (Asynchronous errors)
  process.on('unhandledRejection', (err: any) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });

  // Handle SIGTERM (e.g., from Heroku/Docker)
  process.on('SIGTERM', () => {
    logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      logger.info('💥 Process terminated!');
    });
  });
};

startServer();
