import * as supertest from 'supertest';

let request: supertest.SuperTest<supertest.Test>;
beforeAll(() => {
  request = supertest('http://localhost:3000');
});

/**
 * integration test
 */
describe('GET /collection/seek', () => {
  const testData: any[] = [
    {
      params: {
        title: 'should return result sets by "theme" and "filter" query params',
        theme: 'city',
        filter: 'car,sky'
      },
      expected: {
        totalSize: 10,
        filterSize: 7,
        hasFilteredColection: true
      }
    },
    {
      params: {
        title: 'should return result sets by "theme" query params',
        theme: 'city'
      },
      expected: {
        totalSize: 10,
        filterSize: 7,
        hasFilteredColection: false
      }
    },
    {
      params: {
        title: 'should return result sets by "theme" and empty "filter" query params',
        theme: 'city',
        filter: ''
      },
      expected: {
        totalSize: 10,
        filterSize: 0,
        hasFilteredColection: true
      }
    }
  ]

  testData.forEach((data: any): any => {
    const params: any = data.params
    const expected: any = data.expected
    const query: any = {
      theme: params.theme
    }
    if (params.filter !== undefined) {
      query.filter = params.filter
    }

    it(params.title, (): {} => {
      return request
        .get('/collection/seek')
        .query(query)
        .expect((res: any) => {
          const body: any = res.body

          // array size validation
          const pics: any = body.collection_pictures
          const picSize: number = expected.totalSize
          if (pics.length !== picSize) {
            throw new Error(`size of collection_pictures should be ${picSize}, but ${pics.length}`)
          }

          // key validation
          const keys: string[] = ['collection_id', 'picture_id', 'width', 'height', 'url', 'filtered_assets', 'available_assets']
          let pic: any;

          pic = pics[0]
          keys.forEach((key: string): void => {
            if (!(key in pic)) { throw new Error(`missing key '${key}' in collection_pictures`); }
          })

          if (!expected.hasFilteredColection) {
            if (body.filtered_collection_pictures !== undefined) {
              throw new Error('key \'filtered_collection_pictures\' should be empty')
            }

            return
          }
          // filtered contents validation
          const filters: any = body.filtered_collection_pictures
          const filterSize: number = expected.filterSize
          if (filters.length !== filterSize) {
            throw new Error(`size of filtered_collection_pictures should be ${filterSize}, but ${filters.length}`)
          }
          if (filterSize === 0) {
            return
          }

          pic = filters[0]
          keys.forEach((key: string): void => {
            if (!(key in pic)) { throw new Error(`missing key '${key}' in collection_pictures`); }
          })
        })
        .expect(200);
    })
  })
});

it('is bad request that "theme" query param is empty', (): {} => {
  return request
  .get('/collection/seek')
  .expect(400, {
    errors: {theme: 'theme must be 1~100 length string'}
  });
});
