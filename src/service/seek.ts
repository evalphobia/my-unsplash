import * as express from 'express';

/**
 * GET /collection/seek
 * Return collection from Unsplash.
 */
export function seekCollection(req: express.Request, res: express.Response): void {
  res.send({
    status: true
  });
}
