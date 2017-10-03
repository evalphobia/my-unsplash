import { toJson } from 'unsplash-js';
import {dummyDataPath, isDebug, logDebug} from '../util/util';
import {unsplash} from './unsplash';

/**
 * searchCollections retrieve collections from Unsplash.
 * In debug environemnt, use local json dummy file instead of calling Unsplash API.
 * @param query search word for collections
 * @returns collection list data
 */
export async function searchCollections(query: string): Promise<UnsplashCollection[]> {
  logDebug(`unsplash.searchCollections(${query})`)
  if (isDebug()) {
      return new Promise((resolve: (value?: UnsplashCollection[]) => void): void => {
        resolve(getDummyCollections())
      })
  }

  const result: Promise<UnsplashCollectionResponse> = callSearchCollectionsAPI(query)
  logDebug(`unsplash.searchCollections result = ${JSON.stringify(result)}`)

  // convert Unsplash response into our collection model
  return result.then((res: UnsplashCollectionResponse ) => {
    return <UnsplashCollection[]> res.results
  })
}

/**
 * callSearchCollectionsAPI calls /search/collection API.
 * @param query search word for collections
 * @returns JSON response from /search/collection API
 */
async function callSearchCollectionsAPI(query: string): Promise<UnsplashCollectionResponse> {
  logDebug(`unsplash.callSearchCollectionsAPI(${query})`)

  try {
    return unsplash.search.collections(query)
      .then(toJson)
      .catch((err: {}) => {
        throw new Error(`unsplash.search.collections(${query}) error: ${err}`)
      })
  } catch (err) {
    throw new Error(`callSearchCollectionsAPI error: ${err}`)
  }
}

/**
 * getDummyCollections gets dummy data of /search/collection API from local file.
 * @returns Dummy JSON response from /search/collection API
 */
function getDummyCollections(): UnsplashCollection[] {
  logDebug('unsplash.getDummyCollections()')
  const data: UnsplashCollectionResponse = require(`${dummyDataPath}example_search_collections.json`)

  return <UnsplashCollection[]> data.results
}

/**
 * UnsplashCollection is created from /search/collection API response
 * and contains collection_id and total photo number.
 */
export type UnsplashCollection = {
  id: number,
  total_photos: number
}

/**
 * UnsplashCollectionResponse is /search/collection API response
 */
type UnsplashCollectionResponse = {
  results: UnsplashCollection[]
}
