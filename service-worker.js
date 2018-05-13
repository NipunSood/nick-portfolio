
(function() {
    'use strict';
  
    var filesToCache = [
      '.',
      'style/nick.css',
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
      'images/firebase.png',
      'images/Google-Scholarship-India-Badge.png',
      'images/linux-icon.png',
      'index.html',
      '404.html',
      'offline.html'
    ];
  //Change the name below (after changing cache)
    var staticCacheName = 'pages-cache-v1';
  
    self.addEventListener('install', function(event) {
      console.log('Attempting to install service worker and cache static assets');
      event.waitUntil(
        caches.open(staticCacheName)
        .then(function(cache) {
          return cache.addAll(filesToCache);
        })
      );
    });
  
    self.addEventListener('fetch', function(event) {
      console.log('Fetch event for ', event.request.url);
      event.respondWith(
        caches.match(event.request).then(function(response) {
          if (response) {
            console.log('Found ', event.request.url, ' in cache');
            return response;
          }
          console.log('Network request for ', event.request.url);
          return fetch(event.request).then(function(response) {
            if (response.status === 404) {
              return caches.match('./404.html');
            }
            return caches.open(staticCacheName).then(function(cache) {
              if (event.request.url.indexOf('test') < 0) {
                cache.put(event.request.url, response.clone());
              }
              return response;
            });
          });
        }).catch(function(error) {
          console.log('Error, ', error);
          return caches.match('./offline.html');
        })
      );
    });
  //This Code is used to update the service worker
    self.addEventListener('activate', function(event) {
      console.log('Activating new service worker...');
  
      var cacheWhitelist = [staticCacheName];
  
      event.waitUntil(
        caches.keys().then(function(cacheNames) {
          return Promise.all(
            cacheNames.map(function(cacheName) {
              if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
              }
            })
          );
        })
      );
    });
  
  })();