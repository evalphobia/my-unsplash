my-unsplash
----
My Unsplash app

----

## Setup

### Install dependency

```bash
$ npm install

# or use yarn
# $ yarn
```

### Config API Keys

Change your environment setting

```bash
$ cat config/environment/.env.development

UNSPLASH_APP_ID=    # <= Unsplash Application ID
GCLOUD_PROJECT=     # <= GCP project id
GCLOUD_KEY_FILE=    # <= GCP key file path
SHOW_API_INFO=true  # <= Enable external API response logging
```

### Run server

```bash
$ npm run build
$ npm run serve

# change environment
# $ NODE_ENV=production npm run serve
```

----

## HTTP API

### GET /status

Check server status

```bash
// example
$ curl "http://localhost:3000/status"

{
  "status": true
}
```

### GET /status/config

Check config parameters

```bash
// example
$ curl "http://localhost:3000/status/config"

{
  "status": true,
  "unsplash_application_id": "<Unsplash Application ID>",
  "gcp_project_id": "<GCP Project ID>",
  "gcp_key_file": "<GCP key file path>",
  "show_api_info": true,
  "production": false,
  "debug": false
}
```

### GET /collection/seek

Retrieve photos from Unsplash and photo label from Google Vision API.

| Argument | Type | Opt/Required | Notes |
|---|---|---|---|
|__`theme`__|_string_|Required|||
|__`filter`__|_string_|Optional|set multiple `filter` using comma `,`|

```bash
// example
$ curl "http://localhost:3000/collection/seek?theme=cat&filter=blue,eye,dog"

{
  "filtered_collection_pictures": [ // photos of theme and filter
    {
      "collection_id": 1,
      "picture_id": "xxx",
      "width": 1080,
      "height": 800,
      "url": "https://images.unsplash.com/photo-01234-5678?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&s=f88ef5795f389cec34061a5cb14aa904",
      "filtered_assets": [
        "dog"
      ],
      "available_assets": [
        "dog",
        "dog like mammal"
      ]
      // other pictures
    },
  ]
  "collection_pictures": [ // photos of theme
    {
      "collection_id": 2,
      "picture_id": "yyy",
      "width": 1080,
      "height": 800,
      "url": "https://images.unsplash.com/photo-01234-56789?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&s=67592e340e017ad0bf7a44c6852d6ad7",
      "filtered_assets": [],
      "available_assets": [
        "cat",
        "mammal",
        "small to medium sized cats"
      ]
      // other pictures
    },
  ]
}
```
