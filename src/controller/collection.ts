import * as express from 'express';
import {CollectionRequest} from '../model/CollectionRequest';
import {CollectionResponse} from '../model/CollectionResponse';
import {Validation} from '../model/Validation';
import * as seekService from '../service/seek';

/**
 * GET /collection/seek
 * Return collection from Unsplash.
 */
export function seekCollection(req: express.Request, res: express.Response): void {
  const query: { theme: string, filter: string } = <{ theme: string, filter: string }> req.query;
  const queryModel: CollectionRequest = new CollectionRequest(query)

  const validation: Validation = queryModel.validate()
  if (validation.hasError()) {
    res.status(400).send({
      errors: validation.getErrors()
    });
  }

  const result: CollectionResponse = seekService.seekCollection(queryModel)
  res.send(result);
}
