require("dotenv").config();
const nodemailer = require("nodemailer");

module.exports = {
  sendVerificationMail: async (toEmail, token) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_FROM, // Load from environment variable
          pass: process.env.PASSWORD_FROM, // Load from environment variable
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const emailOptions = {
        from: `Mandaue City Legal Office ${process.env.EMAIL_FROM}`,
        to: toEmail,
        subject: "Email verification",
        headers: {
          "X-Priority": "3", // 1 (highest) - 5 (lowest)
          "X-MSMail-Priority": "Normal", // Outlook-specific
          Importance: "normal", // RFC-compliant way
        },
        html: `<div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                <h3>Thank you for registering with us!</h3>
                <p>We're excited to have you as a part of our community. To get started, we just need to confirm that your email address is valid.</p>
                <p>Please verify your email address using this OTP (One-Time PIN). This helps us ensure that you're the one who initiated the registration process and allows us to send important updates and notifications to your inbox.</p>
                <p>If you did not create an account with us, please disregard this message.</p>
                
                <h4>To confirm your email address, use this OTP below:</h4>
                <div style="margin: 20px 0;">
                <div style="
                    display: inline-block;
                    padding: 15px 25px;
                    font-size: 32px;
                    font-weight: bold;
                    color: #ffffff;
                    background-color: #9EBC8A;
                    border-radius: 8px;
                    letter-spacing: 6px;
                    font-family: 'Courier New', monospace;
                ">
                    ${token}
                </div>
                </div>
            <p>If you have any questions or need assistance, feel free to <a href="mailto:support@budikpetshop@gmail.com">contact us</a>.</p>
        </div>`,
      };

      const info = await transporter.sendMail(emailOptions);
      return info.response;
    } catch (error) {
      return error.message;
    }
  },
  sendNotificationMail: async (toEmail, toName, documents = []) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_FROM, // Load from environment variable
          pass: process.env.PASSWORD_FROM, // Load from environment variable
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const tableRows = documents
        .map(
          (doc) => `
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px; white-space: nowrap; min-width: 150px;">${doc.code}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${doc.description}</td>
        </tr>
      `
        )
        .join("");

      const emailOptions = {
        from: `Mandaue City Legal Office ${process.env.EMAIL_FROM}`,
        to: toEmail,
        subject: "New document assignment notification",
        headers: {
          "X-Priority": "3", // 1 (highest) - 5 (lowest)
          "X-MSMail-Priority": "Normal", // Outlook-specific
          Importance: "normal", // RFC-compliant way
        },
        html: `<div style="font-family: Arial, sans-serif; font-size: 14px; color: #000;">
        <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #000;">
          New document(s) has been assigned to you!
        </h3>
        
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #000;">
          Hi ${toName},
        </p>

        <p style="margin: 0 0 16px 0; font-size: 14px; color: #000;">
          One or more new documents have been assigned to your account. Please review the details below:
        </p>

        <h4 style="margin: 0 0 10px 0; font-size: 15px; color: #000;">Document List</h4>
        
        <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px; font-size: 13px; color: #000;">
          <thead>
            <tr>
              <th style="border: 1px solid #ccc; padding: 8px; background: #f4f4f4; text-align: left;">CODE</th>
              <th style="border: 1px solid #ccc; padding: 8px; background: #f4f4f4; text-align: left;">TITLE/DESIGNATION/DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <p style="margin: 0 0 12px 0; font-size: 14px; color: #000;">
          If you believe this was sent to you in error, you can safely disregard this message.
        </p>

        <p style="margin: 0 0 12px 0; font-size: 14px; color: #000;">
          If you have any questions or need assistance, please don’t hesitate to 
          <a href="mailto:support@budikpetshop@gmail.com" style="color:#000; text-decoration: underline;">
            contact our support team
          </a>.
        </p>

        <p style="margin: 20px 0 0 0; font-size: 14px; color: #000;">
          Thank you,<br>Mandaue City Legal Office Team
        </p>

        <p style="margin: 20px 0 0 0; font-size: 14px; color: #000;">
          If you have any questions or need assistance, feel free to 
          <a href="mailto:support@mandauecitylegalofficeapp@gmail.com" style="color:#000; text-decoration: underline;">
            contact us
          </a>.
        </p>
      </div>`,
      };

      const info = await transporter.sendMail(emailOptions);
      return info.response;
    } catch (error) {
      return error.message;
    }
  },
};
