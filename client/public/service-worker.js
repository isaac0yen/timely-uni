// public/service-worker.js

self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico', // Using favicon.ico as the badge icon
      tag: 'notification',
      renotify: true,
      vibrate: [1000, 500, 1000, 500, 1000],
      sound: '/notify.wav', // Using notify.wav as the notification sound
      actions: [
        { action: 'open', title: 'Open App' },
        { action: 'dismiss', title: 'Dismiss' }
      ],
      data: {
        url: 'https://temi.isaac0yen.com' // The URL to open
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );

    // Send the notification data to the client
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'PUSH_NOTIFICATION',
          notification: data
        });
      });
    });
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  event.waitUntil(
    clients.matchAll({type: 'window'}).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url === 'https://temi.isaac0yen.com' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('https://temi.isaac0yen.com');
      }
    })
  );
});