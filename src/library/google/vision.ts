import * as vision from '@google-cloud/vision'
import {dummyDataPath, logApiInfo, logDebug, useDummyFile} from '../util/util';

const visionClient: GoogleVisionClient = vision({
  projectId: String(process.env.GCLOUD_PROJECT),
  keyFilename: String(process.env.GCLOUD_KEY_FILE)
});

/**
 * annotateImages retrieve label data from Google Vision API by url list.
 * In debug environemnt, use local json dummy file instead of calling Google Vision API.
 * @param list url list
 * @returns label list data
 */
export async function annotateImages(urls: string[]): Promise<VisionLabel[]> {
  if (useDummyFile) {
    return new Promise((resolve: (value?: VisionLabel[]) => void): void => {
      resolve(getDummyLabels())
    })
  }

  return callBatchAnnotateImages(urls)
}

/**
 * callBatchAnnotateImages creates request parameter and calls batchAnnotateImages API.
 * @param urls image url list
 * @returns JSON response from batchAnnotateImages API
 */
async function callBatchAnnotateImages(urls: string[]): Promise<VisionLabel[]> {
  logDebug(`google-vision.callBatchAnnotateImages(${urls})`)

  // create batch rquest parameter for batchAnnotateImages
  const requests: GoogleVisionRequest[] = []
  urls.forEach((url: string) => {
    requests.push(getLabelParameter(url))
  })

  // each batch requests must be containing images less than equal 16
  const maxSize: number = 16
  const requestParts: GoogleVisionRequest[][] = []
  for (let i: number = 0; i < requests.length; i += maxSize) {
    requestParts.push(requests.slice(i, i + maxSize))
  }

  const delay: number = 1000 // ms

  return Promise.all(requestParts.map(async (item: GoogleVisionRequest[], i: number) => {
    // call API with sleep wait to avoid rate limit
    return new Promise((resolve: (value?: Promise<VisionLabel[]>) => void): void => {
      setTimeout(() => {
        resolve(callBatchAnnotateImagesAPI(item))
      },         i * delay)
    })
  })).then((result: VisionLabel[][]) => {
    return result.reduce((a: VisionLabel[], b: VisionLabel[]) => {
      // flatten 2d arrays
      return a.concat(b)
    })
  })
}

/**
 * callBatchAnnotateImagesAPI calls batchAnnotateImages API.
 * @param requests request parameter, which conatains image urls
 * @returns JSON response from batchAnnotateImages API
 */
async function callBatchAnnotateImagesAPI(requests: GoogleVisionRequest[]): Promise<VisionLabel[]> {
  logDebug(`google-vision.callBatchAnnotateImagesAPI(): size == ${requests.length}`)

  return visionClient.batchAnnotateImages(requests)
    .then((res: GoogleVisionResponse[]) => {
      logApiInfo(`[visionClient.batchAnnotateImages] ${JSON.stringify(res)}`)

      // convert response into our photo model
      return newVisionLabel(res)
    })
    .catch((err: any) => {
      throw new Error(`visionClient.batchAnnotateImages() error: ${err}`)
    })
}

/**
 * getDummyPhotos gets dummy data of batchAnnotateImages API from local file.
 * @returns Dummy JSON response from batchAnnotateImages API
 */
function getDummyLabels(): VisionLabel[] {
  logDebug('getDummyLabels()')
  const jsonData: GoogleVisionResponse[] = require(`${dummyDataPath}example_google_vision.json`)

  return newVisionLabel(jsonData)
}

/**
 * getLabelParameter creates request parameter for Label Detaction.
 * @param url image url
 * @returns request patameter data
 */
function getLabelParameter(url: string): GoogleVisionRequest {
  return {
    image: {
      source: {
        imageUri: url
      }
    },
    features: {
      type: vision.v1.types.Feature.Type.LABEL_DETECTION
    }
  }
}

/**
 * VisionLabel is created from batchAnnotateImages API response
 * and contains label and accuracy data.
 */
export type VisionLabel = {
  labels: Label[],
  error: {}
}

/**
 * Label is a label with accuracy of a photo.
 */
export type Label = {
  score: number,
  description: string
}

/**
 * newUnsplashPhotos creates UnsplashPhoto list from the Unsplash API response.
 * @param resp response data from Vision API
 * @returns label list data
 */
function newVisionLabel(resp: GoogleVisionResponse[]): VisionLabel[] {
  if (resp.length === 0) {
    return []
  }
  const list: GoogleVisionResponsePart[]  = resp[0].responses

  return list.map((item: GoogleVisionResponsePart) => {
    return <VisionLabel> {
      error: item.error,
      labels: item.labelAnnotations.map((label: Label): Label => {
        return {
          score: label.score,
          description: label.description
        }
      })
    }
  })
}
