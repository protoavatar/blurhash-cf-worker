import { encode_image } from './blurhash';

interface Env {
	blurhashesabici: KVNamespace;
	TOKEN: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const token = url.searchParams.get('token');
		// Strict check for token existence
		if (!env.TOKEN || env.TOKEN.length === 0) {
			return new Response('You must set the TOKEN environment variable.', {
				status: 401,
			});
		}
		if (token !== env.TOKEN) {
			return new Response('Unauthorized', { status: 401 });
		}

		const imageUrl = url.searchParams.get('img');
		const imageId = url.searchParams.get('id');
		if (!imageUrl) {
			return new Response('img query parameter is required', { status: 400 });
		}

		try {
			const value = await env.blurhashesabici.get(imageId || imageUrl);
			if (value === null) {
				console.log(`No blurhash found for ${imageId || imageUrl}, constructing it`);
				console.log('Image URL:', imageUrl);
				const response = await fetch(imageUrl);
				console.log('Response status:', response.status);
				const buffer = await response.arrayBuffer();
				const image = new Uint8Array(buffer);
				const hash = encode_image(image, 6, 4);
				console.log('Hash:', hash);
				const key = await env.blurhashesabici.put(imageId || imageUrl, hash);

				console.log('Key:', key);
				return new Response(hash, {
					status: 200,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
						'Access-Control-Allow-Headers': 'Content-Type',
					},
				});
			} else {
				console.log(`Blurhash found for ${imageId || imageUrl}, constructing it`, value);

				return new Response(value, {
					status: 200,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
						'Access-Control-Allow-Headers': 'Content-Type',
					},
				});
			}
		} catch (err) {
			// In a production application, you could instead choose to retry your KV
			// read or fall back to a default code path.
			console.error(`KV returned error: ${err}`);
			return new Response('', {
				status: 200,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			});
		}
	},
};
