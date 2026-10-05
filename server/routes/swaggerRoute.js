
import { Router } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerDef as swaggerDefinition } from '../docs/SwaggerDefination.js';

export const router = Router();

const specs = swaggerJsdoc({
    swaggerDefinition,
    apis: ['docs/*.yml', 'routes/*.js'],
});

router.use('/', swaggerUi.serve);
router.get(
    '/',
    swaggerUi.setup(specs, {
        explorer: true,
    }),
);
