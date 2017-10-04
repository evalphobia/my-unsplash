jest.unmock('../src/service/seek')

import * as dotenv from 'dotenv';
import * as path from 'path';
import rewire from 'rewire';
import {init} from '../src/library/util/util';
import {CollectionRequest} from '../src/model/CollectionRequest';
import * as seek from '../src/service/seek';

/**
 * service seek test
 */
dotenv.config({
  path: path.join(__dirname, '..', 'config', 'environment', '.env.test')
})
init(false, false)

describe('service.seek', () => {

  describe('seekCollection', () => {
    test('only theme', async () => {
      const req: CollectionRequest = new CollectionRequest({theme: 'city', filter: null})
      const result: any = await seek.seekCollection(req)
      expect(result.collection_pictures.length).toEqual(10);
      expect(result.filtered_collection_pictures).toBeUndefined();
    });
    test('with filter "dog"', async () => {
      const req: CollectionRequest = new CollectionRequest({theme: 'city', filter: 'dog'})
      const result: any = await seek.seekCollection(req)
      expect(result.collection_pictures.length).toEqual(10);
      expect(result.filtered_collection_pictures).toEqual([]);
    });
    test('with filter "car"', async () => {
      const req: CollectionRequest = new CollectionRequest({theme: 'city', filter: 'car'})
      const result: any = await seek.seekCollection(req)
      expect(result.collection_pictures.length).toEqual(10);
      expect(result.filtered_collection_pictures.length).toEqual(1);
    });
    test('with filter "car,sky,road"', async () => {
      const req: CollectionRequest = new CollectionRequest({theme: 'city', filter: 'car,sky,road'})
      const result: any = await seek.seekCollection(req)
      expect(result.collection_pictures.length).toEqual(10);
      expect(result.filtered_collection_pictures.length).toEqual(7);
    });
  })
})
