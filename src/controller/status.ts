import * as express from 'express';

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
    status: true
  });
}
