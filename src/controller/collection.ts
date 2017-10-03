import * as express from 'express';
import {logDebug} from '../library/util/util';
import {CollectionRequest} from '../model/CollectionRequest';
import {CollectionResponse} from '../model/CollectionResponse';
import {Validation} from '../model/Validation';
import * as seekService from '../service/seek';

/**
 * GET /collection/seek
 * Return collection from Unsplash.
 */
export async function seekCollection(req: express.Request, res: express.Response): Promise<void> {
  logDebug('controller.seekCollection start')
  // parse query
  const query: { theme: string, filter: string, debug: string } = <{ theme: string, filter: string, debug: string }> req.query;
  const queryModel: CollectionRequest = new CollectionRequest(query)

  // validation
  const validation: Validation = queryModel.validate()
  if (validation.hasError()) {
    logDebug('controller.seekCollection validation.hasError')
    res.status(400).send({
      errors: validation.getErrors()
    });
  }

  // get photos from Unsplash and filtered by Google Vision API
  const result: CollectionResponse = await seekService.seekCollection(queryModel)

  logDebug('controller.seekCollection end')
  res.send(result);
}
