// self.addEventListener('push', (event) => {
//   if (!event.data) {
//     return;
//   }

//   const data = event.data.json();

//   const title = data.title || 'VibeConnect';

//   const options = {
//     body: data.body || 'You have a new message',
//     icon: data.icon || '/favicon.ico',
//     badge: data.badge || '/favicon.ico',
//     data: {
//       url: data.url || '/chat'
//     },
//     vibrate: [200, 100, 200]
//   };

//   event.waitUntil(
//     self.registration.showNotification(
//       title,
//       options
//     )
//   );
// });

// self.addEventListener('notificationclick', (event) => {

//   event.notification.close();

//   const urlToOpen =
//     event.notification.data?.url || '/chat';

//   event.waitUntil(

//     clients.matchAll({
//       type: 'window',
//       includeUncontrolled: true
//     }).then((clientList) => {

//       for (const client of clientList) {

//         if ('navigate' in client) {

//           return client
//             .navigate(urlToOpen)
//             .then(() => client.focus());

//         }

//       }

//       if (clients.openWindow) {
//         return clients.openWindow(urlToOpen);
//       }

//     })

//   );

// });

self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();

  const title = data.title || "VibeConnect";

  const options = {
    body: data.body || "You have a new message",

    icon: data.icon || "/favicon.ico",

    badge: data.badge || "/favicon.ico",

    data: {
      url: data.url || "/chat"
    },

    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(
      title,
      options
    )
  );
});


self.addEventListener("notificationclick", (event) => {

  event.notification.close();

  const notificationUrl =
    event.notification.data?.url || "/chat";

  const fullUrl =
    new URL(
      notificationUrl,
      self.location.origin
    ).href;

  event.waitUntil(

    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((clientList) => {

      // If VibeConnect is already open
      for (const client of clientList) {

        if (
          "focus" in client &&
          client.url.startsWith(self.location.origin)
        ) {

          return client
            .navigate(fullUrl)
            .then(() => client.focus());

        }

      }

      // If VibeConnect isn't open
      if (clients.openWindow) {

        return clients.openWindow(fullUrl);

      }

    })

  );

});