/**
 * Response for collection api
 */
export type CollectionResponse = {
  filtered_collection_pictures: CollectionPictures[],
  collection_pictures: CollectionPictures[]
}

type CollectionPictures = {
  collection_id: number,
  picture_id: number,
  width: number,
  height: number,
  url: string,
  filtered_assets: string[],
  available_assets: string[]
}
