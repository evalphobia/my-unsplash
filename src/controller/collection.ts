import * as express from 'express';
import {isSet} from '../helper/type';
import * as seekService from '../service/seek';

/**
 * GET /collection/seek
 * Return collection from Unsplash.
 */
export function seekCollection(req: express.Request, res: express.Response): void {
  const query: { theme: string, filter: string[] } = <{ theme: string, filter: string[] }> req.query;

  // if (!query.isEmpty()) {
  //   res.status(400).send({
  //     errors: errors.mapped()
  //   });

  //   return
  // }

  // result = seekService.seekCollection()
  res.send(query);
}
