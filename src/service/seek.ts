import {annotateImages, Label, VisionLabel} from '../library/google/vision';
import {getPhotosFromCollections, UnsplashPhoto} from '../library/unsplash/collection_photo';
import {searchCollections, UnsplashCollection} from '../library/unsplash/search_collection';
import {isSet, logDebug, logError} from '../library/util/util';
import {CollectionRequest} from '../model/CollectionRequest';
import {CollectionPicture, CollectionResponse, newCollectionPictures} from '../model/CollectionResponse';

/**
 * seekCollection seeks collection from Unsplash API and filtered by Google Vision API.
 * @param req request parameter.
 * @returns return result value.
 */
export async function seekCollection(req: CollectionRequest): Promise<CollectionResponse> {
  const pictures: CollectionPicture[] = await fetchPicturesFromUnsplash(req)
  if (!req.hasFilters()) {
    return { collection_pictures: pictures }
  }

  const data: {pictures: CollectionPicture[],
      filtered_pictures: CollectionPicture[]} = await labelAndFilterPictures(pictures, req.getFilters())

  return {
    filtered_collection_pictures: data.filtered_pictures,
    collection_pictures: data.pictures
  }
}

/**
 * fetchPicturesFromUnsplash fetches pictures in collections by theme from Unsplash API.
 * @param req request parameter.
 * @returns pictures in collections.
 */
async function fetchPicturesFromUnsplash(req: CollectionRequest): Promise<CollectionPicture[]> {
  logDebug('service.fetchPicturesFromUnsplash start')

  const collections: UnsplashCollection[] = await searchCollections(req.getTheme())
  logDebug(`service.seekCollection collections = ${JSON.stringify(collections)}`)

  const photos: UnsplashPhoto[] = await getPhotosFromCollections(collections)
  logDebug(`service.seekCollection pictures = ${JSON.stringify(photos)}`)

  return newCollectionPictures(photos)
}

/**
 * labelAndFilterPictures fetches label data from Google Vision API and filter the picuture by given filter.
 * @param pictures picture list data.
 * @param filter filter parameter.
 * @returns labeled pictures data.
 */
async function labelAndFilterPictures(pictures: CollectionPicture[], filter: string[]):
      Promise<{pictures: CollectionPicture[], filtered_pictures: CollectionPicture[]}> {

  logDebug(`service.getLabelAndFilterPictures start: pictures.length === ${pictures.length}`)

  // fetch label data from GoogleVisionAPI
  const urls: string[] = []
  pictures.forEach((item: CollectionPicture) => {
    urls.push(item.url)
  })
  const labels: VisionLabel[] = await annotateImages(urls)
  if (pictures.length !== labels.length) {
    throw new Error(`image(${pictures.length}) size and label(${labels.length}) size is different`)
  }

  // create temporary map data for filter
  const filterMap: IFilterMap = {}
  filter.forEach((filterName: string) => {
    filterMap[filterName] = true
  })

  const minAccuracy: number = 0.80
  const allPictures: CollectionPicture[] = []
  const filteredPictures: CollectionPicture[] = []

  // loop each pictures
  pictures.forEach((pic: CollectionPicture, i: number) => {
    const label: VisionLabel = labels[i]
    if (isSet(label.error)) {
      logError(`Label Error: ${JSON.stringify(label.error)}`)

      return
    }

    // loop each labels in the picture
    label.labels.forEach((l: Label) => {
      // skip low accuracy
      if (l.score < minAccuracy) {
        return
      }

      const desc: string = l.description
      pic.available_assets.push(desc)

      if (filterMap[desc]) {
        pic.filtered_assets.push(l.description)
      }
    })

    // add filtered picture
    if (pic.filtered_assets.length !== 0) {
      filteredPictures.push(pic)
    }
    allPictures.push(pic)
  })

  return {pictures: allPictures, filtered_pictures: filteredPictures}
}

interface IFilterMap {
  [key: string]: boolean;
}
