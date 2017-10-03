import * as e6p from 'es6-promise';
(<any> e6p).polyfill();
import * as fetch from 'isomorphic-fetch';
(<any> global).fetch = fetch

import unsplashJs from 'unsplash-js';

/**
 * Unsplash API client
 */
export const unsplash: Unsplash = new unsplashJs({
  applicationId: String(process.env.UNSPLASH_APP_ID)
  // secret: String(process.env.UNSPLASH_SECRET)
});
