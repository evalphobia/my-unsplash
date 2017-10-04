import {UnsplashPhoto} from '../library/unsplash/collection_photo';

/**
 * CollectionResponse is response to user for collection api
 */
export type CollectionResponse = {
  filtered_collection_pictures?: CollectionPicture[],
  collection_pictures: CollectionPicture[]
}

/**
 * CollectionPicture is single picture data for response.
 */
export type CollectionPicture = {
  collection_id: number,
  picture_id: number,
  width: number,
  height: number,
  url: string,
  filtered_assets: string[],
  available_assets: string[]
}

/**
 * newCollectionPictures creates CollectionPicture list from the UnsplashPhoto list.
 * @param photos photo list from Unsplash API
 * @returns photo list for our model.
 */
export function newCollectionPictures(photos: UnsplashPhoto[]): CollectionPicture[] {
  const result: CollectionPicture[] = []
  photos.forEach((item: UnsplashPhoto) => {
    result.push(<CollectionPicture> {
      collection_id: item.collection_id,
      picture_id: item.id,
      width: item.width,
      height: item.height,
      url: item.url,
      filtered_assets: [],
      available_assets: []
    })
  })

  return result
}
