import * as express from 'express';
import {isDebug, isProd} from '../library/util/util';

/**
 * GET /status
 * Return server status.
 */
export function getStatus(req: express.Request, res: express.Response): void {
  res.send({
    status: true
  });
}

/**
 * GET /status/condfig
 * Return server cofiguration.
 */
export function getConfig(req: express.Request, res: express.Response): void {
  res.send({
    status: true,
    unsplash_application_id: String(process.env.UNSPLASH_APP_ID),
    production: isProd(),
    debug: isDebug()
  });
}
