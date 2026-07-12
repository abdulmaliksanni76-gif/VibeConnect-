// // require('dotenv').config();
// // const nodemailer = require('nodemailer');

// // const transporter = nodemailer.createTransport({
// //     host: 'smtp.gmail.com',
// //     port: 465, 
// //     secure: true, 
// //     family: 4,
// //     connectionTimeout: 10000,
// //     auth: {
// //         user: process.env.EMAIL_USER,
// //         pass: process.env.EMAIL_PASS
// //     }
// // });

// // exports.sendOtpEmail = async (email, otp) => {
// //     try {
// //         await transporter.sendMail({
// //             from: `"VibeConnect Team" <${process.env.EMAIL_USER}>`,
// //             to: email,
// //             subject: 'Verify your VibeConnect account',
// //             html: `
// //                 <div style="font-family: sans-serif; padding: 20px; border-radius: 10px; background: #f9f9f9;">
// //                     <h2 style="color: #0d6efd;">Welcome to VibeConnect!</h2>
// //                     <p>Your verification code is:</p>
// //                     <h1 style="letter-spacing: 5px; color: #198754;">${otp}</h1>
// //                 </div>
// //             `
// //         });
// //     } catch (error) {
// //         console.error("Email error:", error);
// //         throw error; 
// //     }
// // };


// require('dotenv').config();
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     host: 'smtp-relay.brevo.com',
//     port: 587,
//     secure: false, // Use false for port 587
//     auth: {
//         user: process.env.BREVO_SMTP_USER, // Your Brevo Login Email
//         pass: process.env.BREVO_SMTP_KEY   // Your Brevo SMTP Key (NOT API key)
//     }
// });

// exports.sendOtpEmail = async (email, otp) => {
//     try {
//         await transporter.sendMail({
//             from: `"VibeConnect Team" <${process.env.EMAIL_USER}>`,
//             to: email,
//             subject: 'Verify your VibeConnect account',
//             html: `
//                 <div style="font-family: sans-serif; padding: 20px; border-radius: 10px; background: #f9f9f9;">
//                     <h2 style="color: #0d6efd;">Welcome to VibeConnect!</h2>
//                     <p>Your verification code is:</p>
//                     <h1 style="letter-spacing: 5px; color: #198754;">${otp}</h1>
//                 </div>
//             `
//         });
//     } catch (error) {
//         console.error("Email error:", error);
//         throw error; 
//     }
// };

// // const brevo = require('@getbrevo/brevo');

// // // Initialize the API client
// // const apiInstance = new brevo.TransactionalEmailsApi();

// // // Correctly set the API key using the configuration object
// // apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// // exports.sendOtpEmail = async (email, otp) => {
// //     let sendSmtpEmail = new brevo.SendSmtpEmail();
    
// //     sendSmtpEmail.subject = "Verify your VibeConnect account";
// //     sendSmtpEmail.htmlContent = `
// //         <div style="font-family: sans-serif; padding: 20px; border-radius: 10px; background: #f9f9f9;">
// //             <h2 style="color: #0d6efd;">Welcome to VibeConnect!</h2>
// //             <p>Your verification code is:</p>
// //             <h1 style="letter-spacing: 5px; color: #198754;">${otp}</h1>
// //         </div>
// //     `;
// //     sendSmtpEmail.sender = { "name": "VibeConnect", "email": "vibeconnect.supports@gmail.com" };
// //     sendSmtpEmail.to = [{ "email": email }];

// //     try {
// //         await apiInstance.sendTransacEmail(sendSmtpEmail);
// //     } catch (error) {
// //         console.error("Brevo Email error:", error);
// //         throw error;
// //     }
// // };

// // Use destructuring to import the classes directly
// // const { TransactionalEmailsApi, SendSmtpEmail } = require('@getbrevo/brevo');

// // // Initialize the API client directly
// // const apiInstance = new TransactionalEmailsApi();

// // // Set the API Key using the dedicated configuration method
// // // Note: Ensure BREVO_API_KEY is correctly set in your Render environment
// // apiInstance.setApiKey(0, process.env.BREVO_API_KEY);

// // exports.sendOtpEmail = async (email, otp) => {
// //     let sendSmtpEmail = new SendSmtpEmail();
    
// //     sendSmtpEmail.subject = "Verify your VibeConnect account";
// //     sendSmtpEmail.htmlContent = `
// //         <div style="font-family: sans-serif; padding: 20px; border-radius: 10px; background: #f9f9f9;">
// //             <h2 style="color: #0d6efd;">Welcome to VibeConnect!</h2>
// //             <p>Your verification code is:</p>
// //             <h1 style="letter-spacing: 5px; color: #198754;">${otp}</h1>
// //         </div>
// //     `;
// //     // Ensure this email is a sender you have verified in your Brevo Dashboard
// //     sendSmtpEmail.sender = { "name": "VibeConnect", "email": "vibeconnect.supports@gmail.com" };
// //     sendSmtpEmail.to = [{ "email": email }];

// //     try {
// //         await apiInstance.sendTransacEmail(sendSmtpEmail);
// //     } catch (error) {
// //         console.error("Brevo Email error:", error.response?.body || error);
// //         throw error;
// //     }
// // };

// // const SibApiV3Sdk = require('@getbrevo/brevo');

// // // Initialize the API client
// // const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// // // Configure API key authorization
// // apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// // exports.sendOtpEmail = async (email, otp) => {
// //     let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
// //     sendSmtpEmail.subject = "Verify your VibeConnect account";
// //     sendSmtpEmail.htmlContent = `
// //         <div style="font-family: sans-serif; padding: 20px; border-radius: 10px; background: #f9f9f9;">
// //             <h2 style="color: #0d6efd;">Welcome to VibeConnect!</h2>
// //             <p>Your verification code is:</p>
// //             <h1 style="letter-spacing: 5px; color: #198754;">${otp}</h1>
// //         </div>
// //     `;
// //     sendSmtpEmail.sender = { "name": "VibeConnect", "email": "vibeconnect.supports@gmail.com" };
// //     sendSmtpEmail.to = [{ "email": email }];

// //     try {
// //         return await apiInstance.sendTransacEmail(sendSmtpEmail);
// //     } catch (error) {
// //         console.error("Brevo Email error:", error);
// //         throw error;
// //     }
// // };


const { BrevoClient } = require('@getbrevo/brevo');

// Initialize the client with your API key
const brevo = new BrevoClient({ 
    apiKey: process.env.BREVO_API_KEY 
});

exports.sendOtpEmail = async (email, otp) => {
    try {
        await brevo.transactionalEmails.sendTransacEmail({
            subject: 'Verify your VibeConnect account',
            sender: { name: 'VibeConnect Team', email: 'vibeconnect.supports@gmail.com' },
            to: [{ email: email }],
            htmlContent: `
                <div style="font-family: sans-serif; padding: 20px; border-radius: 10px; background: #f9f9f9;">
                    <h2 style="color: #0d6efd;">Welcome to VibeConnect!</h2>
                    <p>Your verification code is:</p>
                    <h1 style="letter-spacing: 5px; color: #198754;">${otp}</h1>
                </div>
            `
        });
    } catch (error) {
        console.error("Brevo API Email error:", error);
        throw error;
    }
};