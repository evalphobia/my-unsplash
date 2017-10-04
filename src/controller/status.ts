import * as express from 'express';
import {isDebug, isProd, showApiInfo} from '../library/util/util';

/**
 * GET /status
 * Return server status.
 */
export function getStatus(req: express.Request, res: express.Response): void {
  res.send({
    status: true
  });
}

/**
 * GET /status/condfig
 * Return server cofiguration.
 */
export function getConfig(req: express.Request, res: express.Response): void {
  res.send({
    status: true,
    unsplash_application_id: String(process.env.UNSPLASH_APP_ID),
    gcp_project_id: String(process.env.GCLOUD_PROJECT),
    gcp_key_file: String(process.env.GCLOUD_KEY_FILE),
    show_api_info: showApiInfo,
    production: isProd(),
    debug: isDebug()
  });
}
