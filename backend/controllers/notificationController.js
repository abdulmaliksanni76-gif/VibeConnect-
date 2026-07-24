// const User = require('../models/User');

// exports.savePushSubscription = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const subscription = req.body;

//     if (!subscription || !subscription.endpoint) {
//       return res.status(400).json({
//         message: 'Invalid push subscription'
//       });
//     }

//     await User.findByIdAndUpdate(
//       userId,
//       {
//         pushSubscription: subscription
//       },
//       {
//         new: true
//       }
//     );

//     res.status(200).json({
//       message: 'Push subscription saved successfully'
//     });

//   } catch (error) {
//     console.error('Save Push Subscription Error:', error);

//     res.status(500).json({
//       message: 'Failed to save push subscription'
//     });
//   }
// };

const User = require('../models/User');

exports.savePushSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscription = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({
        message: 'Invalid push subscription'
      });
    }

    await User.findByIdAndUpdate(
      userId,
      {
        pushSubscription: subscription
      },
      {
        new: true
      }
    );

    console.log(`✅ Push subscription saved for user: ${userId}`);

    res.status(200).json({
      message: 'Push subscription saved successfully'
    });

  } catch (error) {
    console.error('❌ Save Push Subscription Error:', error);

    res.status(500).json({
      message: 'Failed to save push subscription'
    });
  }
};