// import axios from 'axios';

// const BASE_URL = import.meta.env.VITE_API_URL;

// const urlBase64ToUint8Array = (base64String) => {
//   console.log("VAPID PUBLIC KEY:", base64String);

//   const padding = '='.repeat(
//     (4 - (base64String.length % 4)) % 4
//   );

//   const base64 = (
//     base64String + padding
//   )
//     .replace(/-/g, '+')
//     .replace(/_/g, '/');

//   const rawData = window.atob(base64);

//   return Uint8Array.from(
//     [...rawData].map(
//       char => char.charCodeAt(0)
//     )
//   );
// };

// export const enableNotifications = async () => {

//   console.log("=================================");
//   console.log("NOTIFICATION SETUP STARTED");
//   console.log("=================================");

//   try {

//     console.log(
//       "Notification supported:",
//       'Notification' in window
//     );

//     console.log(
//       "Service Worker supported:",
//       'serviceWorker' in navigator
//     );

//     console.log(
//       "Current permission:",
//       Notification.permission
//     );

//     if (!('Notification' in window)) {
//       console.log("❌ Notifications are not supported");
//       return false;
//     }

//     if (!('serviceWorker' in navigator)) {
//       console.log("❌ Service Workers are not supported");
//       return false;
//     }

//     console.log("Requesting notification permission...");

//     const permission =
//       await Notification.requestPermission();

//     console.log(
//       "Permission result:",
//       permission
//     );

//     if (permission !== 'granted') {
//       console.log(
//         "❌ Notification permission was not granted"
//       );

//       return false;
//     }

//     console.log(
//       "✅ Notification permission granted"
//     );

//     console.log(
//       "Registering service worker..."
//     );

//     const registration =
//       await navigator.serviceWorker.register('/sw.js');

//     console.log(
//       "✅ Service worker registered:",
//       registration
//     );

//     console.log(
//       "Creating push subscription..."
//     );

//     const subscription =
//       await registration.pushManager.subscribe({

//         userVisibleOnly: true,

//         applicationServerKey:
//           urlBase64ToUint8Array(
//             import.meta.env.VITE_VAPID_PUBLIC_KEY
//           )

//       });

//     console.log(
//       "✅ Push subscription created:",
//       subscription
//     );

//     const token =
//       localStorage.getItem('token');

//     console.log(
//       "Authentication token exists:",
//       !!token
//     );

//     console.log(
//       "Sending subscription to backend..."
//     );

//     const response = await axios.post(

//       `${BASE_URL}/api/notifications/subscribe`,

//       subscription,

//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }

//     );

//     console.log(
//       "✅ Backend response:",
//       response.data
//     );

//     console.log(
//       "================================="
//     );

//     console.log(
//       "✅ NOTIFICATIONS ENABLED SUCCESSFULLY"
//     );

//     console.log(
//       "================================="
//     );

//     return true;

//   } catch (error) {

//     console.error(
//       "❌ NOTIFICATION SETUP FAILED"
//     );

//     console.error(
//       "Error:",
//       error
//     );

//     console.error(
//       "Error message:",
//       error.message
//     );

//     if (error.response) {

//       console.error(
//         "Backend status:",
//         error.response.status
//       );

//       console.error(
//         "Backend response:",
//         error.response.data
//       );

//     }

//     return false;

//   }

// };

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// ========================================
// Convert VAPID public key to Uint8Array
// ========================================

const urlBase64ToUint8Array = (base64String) => {

  console.log(
    "VAPID PUBLIC KEY RECEIVED:",
    base64String
  );

  if (!base64String) {

    throw new Error(
      "VITE_VAPID_PUBLIC_KEY is missing. " +
      "Check your frontend .env file and restart Vite."
    );

  }

  const padding =
    '='.repeat(
      (4 - (base64String.length % 4)) % 4
    );

  const base64 =
    (
      base64String + padding
    )
      .replace(/-/g, '+')
      .replace(/_/g, '/');

  let rawData;

  try {

    rawData =
      window.atob(base64);

  } catch (error) {

    throw new Error(
      "Invalid VAPID public key. " +
      "Make sure you copied the correct VAPID PUBLIC KEY."
    );

  }

  return Uint8Array.from(
    [...rawData].map(
      char =>
        char.charCodeAt(0)
    )
  );

};


// ========================================
// Enable Push Notifications
// ========================================

export const enableNotifications = async () => {

  console.log(
    "================================="
  );

  console.log(
    "🔔 NOTIFICATION SETUP STARTED"
  );

  console.log(
    "================================="
  );


  try {

    // ========================================
    // Check Notification Support
    // ========================================

    console.log(
      "Notification supported:",
      'Notification' in window
    );

    console.log(
      "Service Worker supported:",
      'serviceWorker' in navigator
    );


    if (!('Notification' in window)) {

      console.error(
        "❌ Notifications are not supported by this browser."
      );

      return false;

    }


    if (!('serviceWorker' in navigator)) {

      console.error(
        "❌ Service Workers are not supported by this browser."
      );

      return false;

    }


    // ========================================
    // Check Current Permission
    // ========================================

    console.log(
      "Current notification permission:",
      Notification.permission
    );


    // ========================================
    // Request Permission
    // ========================================

    let permission =
      Notification.permission;


    if (permission === 'default') {

      console.log(
        "Requesting notification permission..."
      );

      permission =
        await Notification.requestPermission();

      console.log(
        "Permission result:",
        permission
      );

    } else {

      console.log(
        "Permission already decided:",
        permission
      );

    }


    // ========================================
    // Permission Not Granted
    // ========================================

    if (permission !== 'granted') {

      console.warn(
        "❌ Notification permission was not granted."
      );

      return false;

    }


    console.log(
      "✅ Notification permission granted."
    );


    // ========================================
    // Get VAPID Public Key
    // ========================================

    const vapidPublicKey =
      import.meta.env.VITE_VAPID_PUBLIC_KEY;


    console.log(
      "VAPID PUBLIC KEY FROM ENV:",
      vapidPublicKey
    );


    if (!vapidPublicKey) {

      throw new Error(
        "VITE_VAPID_PUBLIC_KEY is missing. " +
        "Check your frontend .env file and restart Vite."
      );

    }


    // ========================================
    // Register Service Worker
    // ========================================

    console.log(
      "Registering service worker..."
    );


    const registration =
      await navigator.serviceWorker.register(
        '/sw.js'
      );


    console.log(
      "✅ Service worker registered:",
      registration
    );


    // ========================================
    // Wait Until Service Worker Is Ready
    // ========================================

    console.log(
      "Waiting for service worker to become ready..."
    );


    const readyRegistration =
      await navigator.serviceWorker.ready;


    console.log(
      "✅ Service worker is ready:",
      readyRegistration
    );


    // ========================================
    // Check Existing Push Subscription
    // ========================================

    console.log(
      "Checking for existing push subscription..."
    );


    let subscription =
      await readyRegistration.pushManager.getSubscription();


    // ========================================
    // Create New Subscription If Needed
    // ========================================

    if (!subscription) {

      console.log(
        "No existing subscription found."
      );

      console.log(
        "Creating new push subscription..."
      );


      const applicationServerKey =
        urlBase64ToUint8Array(
          vapidPublicKey
        );


      subscription =
        await readyRegistration.pushManager.subscribe({

          userVisibleOnly: true,

          applicationServerKey

        });


      console.log(
        "✅ New push subscription created:",
        subscription
      );

    } else {

      console.log(
        "✅ Existing push subscription found:",
        subscription
      );

    }


    // ========================================
    // Get Authentication Token
    // ========================================

    const token =
      localStorage.getItem('token');


    console.log(
      "Authentication token exists:",
      !!token
    );


    if (!token) {

      console.warn(
        "⚠️ No authentication token found."
      );

      console.warn(
        "The notification permission and subscription " +
        "were successful, but the subscription cannot " +
        "be saved to the backend until the user is logged in."
      );

      return false;

    }


    // ========================================
    // Send Subscription To Backend
    // ========================================

    console.log(
      "Sending push subscription to backend..."
    );


    const response =
      await axios.post(

        `${BASE_URL}/api/notifications/subscribe`,

        subscription,

        {

          headers: {

            Authorization:
              `Bearer ${token}`,

            'Content-Type':
              'application/json'

          }

        }

      );


    // ========================================
    // Backend Response
    // ========================================

    console.log(
      "✅ Backend response:",
      response.data
    );


    console.log(
      "================================="
    );

    console.log(
      "🎉 NOTIFICATIONS ENABLED SUCCESSFULLY"
    );

    console.log(
      "================================="
    );


    return true;


  } catch (error) {


    // ========================================
    // Error Handling
    // ========================================

    console.error(
      "================================="
    );

    console.error(
      "❌ NOTIFICATION SETUP FAILED"
    );

    console.error(
      "================================="
    );


    console.error(
      "Error:",
      error
    );


    console.error(
      "Error message:",
      error.message
    );


    if (error.response) {

      console.error(
        "Backend status:",
        error.response.status
      );


      console.error(
        "Backend response:",
        error.response.data
      );

    }


    return false;

  }

};