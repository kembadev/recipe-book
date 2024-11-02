import { Router } from 'express';

import swaggerUI from 'swagger-ui-express';
import swaggerDocument from './swagger.json' with { type: 'json' };

export const apiDocsRouter = Router();

apiDocsRouter.use('/', swaggerUI.serve);
apiDocsRouter.get('/', swaggerUI.setup(swaggerDocument));
