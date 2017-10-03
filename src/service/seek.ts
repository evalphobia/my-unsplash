import {getPhotosFromCollections, UnsplashPhoto} from '../library/unsplash/collection_photo';
import {searchCollections, UnsplashCollection} from '../library/unsplash/search_collection';
import {logDebug} from '../library/util/util';
import {CollectionRequest} from '../model/CollectionRequest';
import {CollectionPicture, CollectionResponse, newCollectionPictures} from '../model/CollectionResponse';

/**
 * seekCollection seeks collection from Unsplash API and filtered by Google Vision API.
 * @param req request parameter.
 * @returns return result value.
 */
export async function seekCollection(req: CollectionRequest): Promise<CollectionResponse> {
  logDebug('service.seekCollection start')

  const collections: UnsplashCollection[] = await searchCollections(req.getTheme())
  logDebug(`service.seekCollection collections = ${JSON.stringify(collections)}`)

  const photos: UnsplashPhoto[] = getPhotosFromCollections(collections)
  logDebug(`service.seekCollection pictures = ${JSON.stringify(photos)}`)

  const pictures: CollectionPicture[] = newCollectionPictures(photos)

  return <CollectionResponse> {
    filtered_collection_pictures: [],
    collection_pictures: pictures
  }
}
