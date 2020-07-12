const glob = require('glob');
const fs = require('fs');

const dest = 'dist/service-worker.js';
const staticAssetsCacheName = 'GK-assets-v2';
const dynamicCacheName = 'GK-dynamic-v2';

let staticAssetsCacheFiles = glob
  .sync('dist/**/*')
  .map((path) => {
    return path.slice(5);
  })
  .filter((file) => {
    if (/\.gz$/.test(file)) return false;
    if (/service-worker\.js$/.test(file)) return false;
    if (!/\.+/.test(file)) return false;
    return true;
  });

const stringFileCachesArray = JSON.stringify(staticAssetsCacheFiles);

const serviceWorkerScript = `var staticAssetsCacheName = '${staticAssetsCacheName}';
var dynamicCacheName = '${dynamicCacheName}';
self.addEventListener('install', function (event) {
    self.skipWaiting();
    event.waitUntil(
      caches.open(staticAssetsCacheName).then(function (cache) {
        cache.addAll([
            '/',
            ${stringFileCachesArray.slice(1, stringFileCachesArray.length - 1)}
        ]
        );
      }).catch((error) => {
        console.log('Error caching static assets:', error);
      })
    );
  });
  self.addEventListener('activate', function (event) {
    if (self.clients && clients.claim) {
      clients.claim();
    }
    event.waitUntil(
      caches.keys().then(function (cacheNames) {
        return Promise.all(
          cacheNames.filter(function (cacheName) {
            return (cacheName.startsWith('GK-')) && cacheName !== staticAssetsCacheName;
          })
          .map(function (cacheName) {
            return caches.delete(cacheName);
          })
        ).catch((error) => {
            console.log('Some error occurred while removing existing cache:', error);
        });
      }).catch((error) => {
        console.log('Some error occurred while removing existing cache:', error);
    }));
  });
  self.addEventListener('fetch', (event) => {

    if (event.request.url.indexOf("https://api.football-data.org/v2/matches/") > -1) {
        event.waitUntil(caches.open(dynamicCacheName).then(function (cache) {
            return fetch(event.request).then(function (response) {
                return cache.put(event.request, response.clone()).then(function () {
                    return response;
                });
            }).catch(err => console.log(err))
        }))
    } else if (event.request.url === "https://api.football-data.org/v2/matches?status=SCHEDULED" || event.request.url.indexOf("/scorers") > -1 || event.request.url.indexOf("/standings") > -1) {

        event.respondWith(caches.open(dynamicCacheName).then(function (cache) {
            return cache.match(event.request, { ignoreSearch: true }).then(function (matching) {
                return matching || fetch(event.request).then((fetchResponse) => {
                    return cacheDynamicRequestData(dynamicCacheName, event.request.url, fetchResponse);
                }).catch((error) => {
                    console.log(error);
                });
            })
        }))

        event.waitUntil(caches.open(dynamicCacheName).then(function (cache) {
            return fetch(event.request).then(function (response) {
                return cache.put(event.request, response.clone()).then(function () {
                    return response;
                });
            }).catch(err => console.log(err))
        }))
    } else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then((response) => {
                return response || fetch(event.request)
                    .then((fetchResponse) => {
                        return cacheDynamicRequestData(dynamicCacheName, event.request.url, fetchResponse);
                    }).catch((error) => {
                        console.log(error);
                    });
            }).catch((error) => {
                console.log(error);
            })
        );
    }
  });
  self.addEventListener('push', function(event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    var options = {
            body: body,
            icon: 'src/assets/icons/icon-96x96.png',
            vibrate: [100, 50, 100],
            data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});

  function cacheDynamicRequestData(dynamicCacheName, url, fetchResponse) {
    return caches.open(dynamicCacheName)
      .then((cache) => {
        cache.put(url, fetchResponse.clone());
        return fetchResponse;
      }).catch((error) => {
        console.log(error);
      });
  }
`;

fs.writeFile(dest, serviceWorkerScript, function (error) {
  if (error) return;
  console.log('Service Worker Write success');
});