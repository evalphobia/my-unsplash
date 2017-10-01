/**
 * Module dependencies.
 */
import * as compression from 'compression';  // compresses requests
import * as dotenv from 'dotenv';
import * as errorHandler from 'errorhandler';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import {isSet} from './helper/type';

import expressValidator = require('express-validator')

const app: express.Express = express();
const env: string = String(app.get('env'));

function isProd(): boolean {
  return env === 'production';
}

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({
  path: path.join(__dirname, '..', 'config', 'environment', `.env.${env}`)
})
console.log(path.join(__dirname, '..', 'config', 'environment', `.env.${env}`))

/**
 * Controllers (route handlers).
 */
import * as collectionController from './controller/collection';
import * as statusController from './controller/status';

/**
 * Express configuration.
 */
let port: number;
if (isSet(process.env.PORT)) {
  port = Number(process.env.PORT)
} else {
  port = 3000
}
app.set('port', port);
app.use(compression());

if (isProd()) {
  app.use(logger('combined'));
} else {
  app.use(logger('dev'));
}
app.use(expressValidator());

/**
 * Primary app routes.
 */
app.get('/status', statusController.getStatus);
app.get('/status/config', statusController.getConfig);
app.get('/collection/seek', collectionController.seekCollection);

/**
 * Error Handler. Provides full stack - remove for production
 */
if (!isProd()) {
  app.use(errorHandler());
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(('  App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
