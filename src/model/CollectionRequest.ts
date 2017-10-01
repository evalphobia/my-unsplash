/**
 * Request for collection api
 */
export class CollectionRequest {
  private theme: string
  private filter: string[]
  constructor() {

  }
}

/**
 * Initializer for CollectionRequest from query parameter.
 */
export function newCollectionRequestFromQuery(query: CollectionRequest): CollectionRequest {
  return query
}
