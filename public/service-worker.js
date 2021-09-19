const FILES_TO_CACHE = [
	'/',
	'/index.html',
	'/public/css/styles.css',
	'/public/js/index.js',
	'/public/js/idb.js',
	'public/icons/icon-72x72.png',
	'public/icons/icon-96x96.png',
	'public/icons/icon-128x128.png',
	'public/icons/icon-144x144.png',
	'public/icons/icon-152x152.png',
	'public/icons/icon-192x192.png',
	'/public/icons/icon-384x384.png',
	'/public/icons/icon-512x512.png',
	'/manifest.json',
];

const CACHE_NAME = 'static-cache-v1';
const DATA_CACHE_NAME = 'data-cache-v1';

self.addEventListener('install', (evt) => {
	evt.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(FILES_TO_CACHE);
		})
	);
});

self.addEventListener('fetch', (evt) => {
	if (evt.request.url.includes('/api/')) {
		evt.respondWith(
			caches
				.open(DATA_CACHE_NAME)
				.then((cache) => {
					return fetch(evt.request)
						.then((response) => {
							if (response.status === 200) {
								cache.put(evt.request, response.clone());
							}

							return response;
						})
						.catch(() => {
							return cache.match(evt.request);
						});
				})
				.catch((err) => console.log(err))
		);

		return;
	}

	evt.respondWith(
		fetch(evt.request).catch(() => {
			return caches.match(evt.request).then((response) => {
				if (response) {
					return response;
				} else if (evt.request.headers.get('accept').includes('text/html')) {
					return caches.match('/');
				}
			});
		})
	);
});
