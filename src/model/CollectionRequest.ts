import {isSet} from '../library/util/util';
import {Validation} from './Validation'

/**
 * User request for collection api
 */
export class CollectionRequest {
  private theme: string
  private filter: string
  private parsedFilter: string[] = []

  constructor(req: { theme: string, filter: string } ) {
    this.theme = req.theme
    this.filter = req.filter
    if (isSet(req.filter)) {
      this.parsedFilter = req.filter.split(',')
    }
  }

  /**
   * validate validates request paramter.
   * @returns return Validation model, which might contain error messages.
   */
  public validate(): Validation  {
    const validation: Validation = new Validation()
    if (!validation.isStringLength(this.theme, 1, 100)) {
      validation.addError('theme', 'theme must be 1~100 length string')
    }
    if (!validation.isStringLength(this.filter, 0, 200)) {
      validation.addError('filter', 'filter must be under 200 length string')
    }

    return validation
  }

  /**
   * getTheme returns `theme` parameter.
   * @returns 'theme' for search query of Unsplash collection
   */
  public getTheme(): string {
    return this.theme
  }

  /**
   * getFilters returns array of `filter` parameter.
   * @returns 'filter' parameter to filtering contents
   */
  public getFilters(): string[] {
    return this.parsedFilter
  }
}
