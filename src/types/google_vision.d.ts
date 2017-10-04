// Type definitions for ./node_modules/@google-cloud/vision/src/index.js
// Project: github.com/evalphobia/my-unsplash
// Definitions by: evalphobia
// Definitions: https://github.com/borisyankov/DefinitelyTyped

interface GoogleVisionClient {
	batchAnnotateImages(requests: GoogleVisionRequest[]): Promise<GoogleVisionResponse[]>
}

interface GoogleVisionRequest {
	image: {
	  source: {
		imageUri: string
	  }
	},
	features: {
	  type: string
	}
}

interface GoogleVisionResponse {
  responses: GoogleVisionResponsePart[]
}

interface GoogleVisionResponsePart {
	labelAnnotations: Label[],
	error: {}
}

interface Label {
	score: number,
	description: string
}

interface GoogleVisionStatic {
	(config?: { projectId: string, keyFilename: string }): GoogleVisionClient,
	v1: {
		types: {
			Feature: {
				Type: {
					LABEL_DETECTION: string
				}
			}
		}
	}
}


declare module '@google-cloud/vision'{
	var vision: GoogleVisionStatic;
	export = vision;
}
