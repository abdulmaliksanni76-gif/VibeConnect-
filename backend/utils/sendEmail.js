// require('dotenv').config();
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465, 
//     secure: true, 
//     family: 4,
//     connectionTimeout: 10000,
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
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

// const SibApiV3Sdk = require('@getbrevo/brevo');

// const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
// const apiKey = apiInstance.authentications['apiKey'];
// apiKey.apiKey = process.env.BREVO_API_KEY;
const brevo = require('@getbrevo/brevo');

// Initialize the API client correctly for the new SDK
const apiInstance = new brevo.TransactionalEmailsApi();

// Set the API Key
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

exports.sendOtpEmail = async (email, otp) => {
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    sendSmtpEmail.subject = "Verify your VibeConnect account";
    sendSmtpEmail.htmlContent = `
        <div style="font-family: sans-serif; padding: 20px; border-radius: 10px; background: #f9f9f9;">
            <h2 style="color: #0d6efd;">Welcome to VibeConnect!</h2>
            <p>Your verification code is:</p>
            <h1 style="letter-spacing: 5px; color: #198754;">${otp}</h1>
        </div>
    `;
    sendSmtpEmail.sender = { "name": "VibeConnect", "email": "vibeconnect.supports@gmail.com" };
    sendSmtpEmail.to = [{ "email": email }];

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
        console.error("Brevo Email error:", error);
        throw error;
    }
};