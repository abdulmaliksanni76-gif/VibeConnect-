// const webpush = require('web-push');

// webpush.setVapidDetails(
//   process.env.VAPID_EMAIL,
//   process.env.VAPID_PUBLIC_KEY,
//   process.env.VAPID_PRIVATE_KEY
// );

// const sendPushNotification = async (subscription, payload) => {
//   try {
//     if (!subscription) {
//       return;
//     }

//     await webpush.sendNotification(
//       subscription,
//       JSON.stringify(payload)
//     );

//     return true;

//   } catch (error) {
//     console.error(
//       'Push notification error:',
//       error.message
//     );

//     // Subscription has expired or is no longer valid
//     if (error.statusCode === 404 || error.statusCode === 410) {
//       return false;
//     }

//     return false;
//   }
// };

// module.exports = {
//   sendPushNotification
// };

const webpush = require('web-push');

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const sendPushNotification = async (subscription, payload) => {
  if (!subscription || !subscription.endpoint) {
    console.log('⚠️ No valid push subscription found');
    return;
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );

    console.log('✅ Push notification sent successfully');

  } catch (error) {

    console.error(
      '❌ Push notification failed:',
      error.statusCode,
      error.body || error.message
    );

    // Subscription has expired or is no longer valid
    if (error.statusCode === 404 || error.statusCode === 410) {
      console.log('⚠️ Push subscription is expired or invalid');
    }
  }
};

module.exports = {
  sendPushNotification
};