# blurhash cloudflare workers

This is a simple cloudflare worker that uses blurhash to generate a placeholder image for a given image url.

[demo](https://blurhash-cf-worker.pages.dev/)

## Build wasm with rust

docker build image

```shell
docker build -t rust-wasm .
```

build wasm

```shell
docker run --rm -v $(pwd):/usr/src/app rust-wasm
```

## Run server

```shell
cd worker && pnpm dev
```

Agregue la opcion de guardar los blurhashes en una dB KV en cloudflare, para guardar aquellas que ya calcule y obtenerlas mas rapido.
Para eso le paso el id de la foto como parametro y la url (Si no hay id usa la URL como key). Por otro lado hay que pasarle un parametro token con la url
Implementacion KV: https://developers.cloudflare.com/kv/get-started/
implementacion secret: https://developers.cloudflare.com/workers/configuration/secrets/

Use the command 'npx wrangler secret put --env production TOKEN' to deploy a securely stored token to Cloudflare. With this command, you will be prompted to enter a random secret value, which will be used to authenticate your requests with the HTTP Authorization header as described below. You can also set this encrypted value directly in your Cloudflare dashboard.
Deploy the worker with 'npm run deploy'
