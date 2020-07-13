var staticAssetsCacheName = 'GK-assets-v2';
var dynamicCacheName = 'GK-dynamic-v2';
self.addEventListener('install', function (event) {
    self.skipWaiting();
    event.waitUntil(
      caches.open(staticAssetsCacheName).then(function (cache) {
        cache.addAll([
            '/',
            "app.js","app~detail~team.js","competition-detail.html","detail.js","index.html","manifest.json","src/assets/icons/152.png","src/assets/icons/167.png","src/assets/icons/180.png","src/assets/icons/256.png","src/assets/icons/512.png","src/assets/icons/favicon.ico","src/assets/icons/icon-128x128.png","src/assets/icons/icon-144x144.png","src/assets/icons/icon-152x152.png","src/assets/icons/icon-192x192.png","src/assets/icons/icon-384x384.png","src/assets/icons/icon-512x512.png","src/assets/icons/icon-72x72.png","src/assets/icons/icon-96x96.png","src/assets/images/bundesliga.png","src/assets/images/crest.png","src/assets/images/eredivise.png","src/assets/images/laliga.png","src/assets/images/ligue.png","src/assets/images/premier-league.png","src/assets/splash/apple-splash-1125-2436.jpg","src/assets/splash/apple-splash-1136-640.jpg","src/assets/splash/apple-splash-1242-2208.jpg","src/assets/splash/apple-splash-1242-2688.jpg","src/assets/splash/apple-splash-1334-750.jpg","src/assets/splash/apple-splash-1536-2048.jpg","src/assets/splash/apple-splash-1668-2224.jpg","src/assets/splash/apple-splash-1668-2388.jpg","src/assets/splash/apple-splash-1792-828.jpg","src/assets/splash/apple-splash-2048-1536.jpg","src/assets/splash/apple-splash-2048-2732.jpg","src/assets/splash/apple-splash-2208-1242.jpg","src/assets/splash/apple-splash-2224-1668.jpg","src/assets/splash/apple-splash-2388-1668.jpg","src/assets/splash/apple-splash-2436-1125.jpg","src/assets/splash/apple-splash-2688-1242.jpg","src/assets/splash/apple-splash-2732-2048.jpg","src/assets/splash/apple-splash-640-1136.jpg","src/assets/splash/apple-splash-750-1334.jpg","src/assets/splash/apple-splash-828-1792.jpg","src/pages/detail.html","src/pages/home.html","src/pages/keeper.html","src/pages/team.html","team-detail.html","team.js","vendors~app~detail~team.js"
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
