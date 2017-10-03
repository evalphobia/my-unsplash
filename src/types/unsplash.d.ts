// Type definitions for ./node_modules/unsplash-js/lib/unsplash.js
// Project: github.com/evalphobia/my-unsplash
// Definitions by: evalphobia
// Definitions: https://github.com/borisyankov/DefinitelyTyped

interface Unsplash {
	search: SearchAPI
	collections: CollectionAPI
}

interface SearchAPI {
	collections(query: string): Promise<any>
}

interface CollectionAPI {
	getCollectionPhotos(collectionId: number, page?: number, perPage?: number): Promise<any>
}

interface UnsplashStatic {
	new (options : {applicationId: string}): Unsplash;
	search: SearchAPI
}

declare module 'unsplash-js'{
  export function toJson(res : any): any;

  var unsplash: UnsplashStatic;
  export default unsplash;
}


