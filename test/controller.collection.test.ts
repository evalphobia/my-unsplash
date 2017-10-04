import * as supertest from 'supertest';

let request: supertest.SuperTest<supertest.Test>;
beforeAll(() => {
  request = supertest('http://localhost:3000');
});

/**
 * integration test
 */
describe('GET /collection/seek', () => {
  it('should return result sets by "theme" and "filter" query params', (): {} => {
    const theme: string = 'car';
    const expected: {} = {
      theme: theme,
      filter: 'red,blue'
    }

    return request
    .get('/collection/seek')
    .query({
      theme: theme,
      filter: 'red,blue'
    })
    .expect(200, {});
  });

  it('is bad request that "theme" query param is empty', (): {} => {
    return request
    .get('/collection/seek')
    .expect(400, {
      errors: {theme: 'theme must be 1~100 length string'}
    });
  });
});
