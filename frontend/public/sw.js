// self.addEventListener("push", (event) => {
//   console.log("[Service Worker] Push received");

//   let data = {};

//   try {
//     if (event.data) {
//       data = event.data.json();
//     }
//   } catch (error) {
//     console.error(
//       "[Service Worker] Failed to parse push data:",
//       error
//     );
//   }

//   const title = data.title || "VibeConnect";

//   const options = {
//     body: data.body || "You have a new message",

//     icon: data.icon || "/favicon.ico",

//     badge: data.badge || "/favicon.ico",

//     data: {
//       // This can be:
//       // /chat/conversationId
//       // or:
//       // /chat/conversationId?messageId=messageId
//       url: data.url || "/chat"
//     },

//     vibrate: [200, 100, 200],

//     // Keeps notifications from unnecessarily stacking
//     // when the same notification tag is used.
//     tag: data.tag || "vibeconnect-message",

//     // Allows a newer notification to replace the previous
//     // notification with the same tag.
//     renotify: true
//   };

//   event.waitUntil(
//     self.registration.showNotification(
//       title,
//       options
//     )
//   );
// });


// self.addEventListener("notificationclick", (event) => {
//   console.log("[Service Worker] Notification clicked");

//   // Close the notification immediately
//   event.notification.close();

//   const notificationUrl =
//     event.notification.data?.url || "/chat";

//   // Convert relative URL into an absolute URL
//   const fullUrl = new URL(
//     notificationUrl,
//     self.location.origin
//   ).href;

//   event.waitUntil(

//     clients.matchAll({
//       type: "window",
//       includeUncontrolled: true
//     })

//     .then((clientList) => {

//       // ------------------------------------------
//       // CHECK IF VIBECONNECT IS ALREADY OPEN
//       // ------------------------------------------

//       for (const client of clientList) {

//         if (
//           "focus" in client &&
//           client.url.startsWith(self.location.origin)
//         ) {

//           // Navigate existing VibeConnect window
//           // to the notification URL.
//           return client
//             .navigate(fullUrl)
//             .then(() => client.focus())
//             .catch(() => client.focus());

//         }

//       }

//       // ------------------------------------------
//       // VIBECONNECT IS NOT OPEN
//       // ------------------------------------------

//       if (clients.openWindow) {

//         return clients.openWindow(fullUrl);

//       }

//     })

//   );
// });

self.addEventListener("push", (event) => {
  console.log("Push notification received");

  if (!event.data) {
    console.log("Push event has no data");
    return;
  }

  let data;

  try {
    data = event.data.json();
  } catch (error) {
    console.error("Failed to parse push data:", error);

    data = {
      title: "VibeConnect",
      body: event.data.text() || "You have a new message",
      url: "/chat"
    };
  }

  const title = data.title || "VibeConnect";

  const options = {
    body: data.body || "You have a new message",

    icon: data.icon || "/favicon.ico",

    badge: data.badge || "/favicon.ico",

    tag: data.tag || "vibeconnect-message",

    renotify: true,

    requireInteraction: false,

    vibrate: [200, 100, 200],

    data: {
      url: data.url || "/chat",
      conversationId: data.conversationId || null,
      messageId: data.messageId || null
    }
  };

  event.waitUntil(
    self.registration.showNotification(
      title,
      options
    )
  );
});


self.addEventListener("notificationclick", (event) => {

  console.log("Notification clicked");

  event.notification.close();

  const notificationData =
    event.notification.data || {};

  const notificationUrl =
    notificationData.url || "/chat";

  const fullUrl =
    new URL(
      notificationUrl,
      self.location.origin
    ).href;

  console.log(
    "Opening notification URL:",
    fullUrl
  );

  event.waitUntil(

    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    })

    .then((clientList) => {

      /*
       * CASE 1:
       * VibeConnect is already open somewhere.
       */
      for (const client of clientList) {

        if (
          client.url.startsWith(
            self.location.origin
          )
        ) {

          return client.focus().then(() => {

            if ("navigate" in client) {

              return client.navigate(
                fullUrl
              );

            }

          });

        }

      }


      /*
       * CASE 2:
       * VibeConnect is not currently open.
       *
       * Open a completely new browser window/tab.
       */
      if (clients.openWindow) {

        return clients.openWindow(
          fullUrl
        );

      }

    })

  );

});