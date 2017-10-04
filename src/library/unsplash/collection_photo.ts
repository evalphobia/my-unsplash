import { toJson } from 'unsplash-js';
import {dummyDataPath, isDebug, logApiInfo, logDebug} from '../util/util';
import {UnsplashCollection} from './search_collection';
import {unsplash} from './unsplash';

/**
 * getPhotosFromCollections retrieve photos from Unsplash by collection list.
 * In debug environemnt, use local json dummy file instead of calling Unsplash API.
 * @param list collection list of Unsplash
 * @returns photo list data
 */
export async function getPhotosFromCollections(list: UnsplashCollection[]): Promise<UnsplashPhoto[]> {
  if (isDebug()) {
    return new Promise((resolve: (value?: UnsplashPhoto[]) => void): void => {
      resolve(getDummyPhotos())
    })
  }

  return Promise.all(list.map(async (item: UnsplashCollection) => {
    return callGetCollectionPhotosAPI(item.id)
  })).then((result: UnsplashPhoto[][]) => {
    return result.reduce((a: UnsplashPhoto[], b: UnsplashPhoto[]) => {
      // flattern 2d arrays
      return a.concat(b)
    })
  })
}

/**
 * callGetCollectionPhotosAPI calls /collections/:id/photos API.
 * @param id collection id
 * @returns JSON response from /collections/:id/photos API
 */
async function callGetCollectionPhotosAPI(id: number): Promise<UnsplashPhoto[]> {
  logDebug(`unsplash.callGetCollectionPhotosAPI(${id})`)
  const firstPage: number = 1
  const maxPhotos: number = 8 // only 8 photos to fetch

  return unsplash.collections.getCollectionPhotos(id, firstPage, maxPhotos)
    .then(toJson)
    .then((res: UnsplashPhotoResponse) => {
      logApiInfo(`[unsplash.collections.getCollectionPhotos(${id})] ${JSON.stringify(res)}`)

      // convert response into our photo model
      return newUnsplashPhotos(res, id)
    })
}

/**
 * getDummyPhotos gets dummy data of /collections/:id/photos API from local file.
 * @returns Dummy JSON response from /collections/:id/photos API
 */
function getDummyPhotos(): UnsplashPhoto[] {
  logDebug('unsplash.getDummyPhotos()')
  const jsonData: UnsplashPhotoResponsePart[] = require(`${dummyDataPath}example_collection_photos.json`)

  return newUnsplashPhotos(jsonData, 0)
}

/**
 * UnsplashPhoto is created from /collections/:id/photos API response
 * and contains photo data.
 */
export type UnsplashPhoto = {
  id: number,
  collection_id: number,
  width: number,
  height: number,
  url: string
}

/**
 * UnsplashPhotoResponse is /collections/:id/photos API response
 */
type UnsplashPhotoResponse = UnsplashPhotoResponsePart[]

/**
 * UnsplashPhotoResponsePart is part of /collections/:id/photos API response
 */
type UnsplashPhotoResponsePart = {
  id: number,
  collection_id: number,
  width: number,
  height: number,
  urls: {regular: string}
}

/**
 * newUnsplashPhotos creates UnsplashPhoto list from the Unsplash API response.
 * @param list photo list from Unsplash API
 * @returns photo list data with collection id
 */
function newUnsplashPhotos(list: UnsplashPhotoResponsePart[], collectionId: number): UnsplashPhoto[] {
  return list.map((item: UnsplashPhotoResponsePart) => {
    return <UnsplashPhoto> {
      id: item.id,
      width: item.width,
      height: item.height,
      url: item.urls.regular,
      collection_id: collectionId
    }
  })
}
