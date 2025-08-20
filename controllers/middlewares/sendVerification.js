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
        from: process.env.EMAIL_FROM,
        to: toEmail,
        subject: "Email verification",
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
};
