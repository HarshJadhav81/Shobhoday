import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shobhoday E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for the Shobhoday E-Commerce backend.',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/*/routes/*.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJSDoc(options);
