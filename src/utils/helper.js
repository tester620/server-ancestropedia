import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};

export const sendPassMail = async (otp, user) => {
  const mailOptions = {
    from: `"Ancestropedia Team" <${process.env.EMAIL}>`,
    to: user.email,
    subject: "Your Ancestropedia Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img 
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=294,fit=crop,q=95/mjE7lpywOyIq5zKx/ancestropedia-1-mePx4pQ230uGow26.png" 
            alt="Ancestropedia Logo" 
            style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%;" 
          />
        </div>

        <h2 style="text-align: center; color: #007BFF;">Password Reset Request</h2>

        <p>Hello ${user.firstName || "User"},</p>

        <p>We received a request to reset your password for your Ancestropedia account.</p>

        <p>Please use the following One-Time Password (OTP) to reset your password:</p>

        <div style="text-align: center; margin: 30px 0;">
          <span style="
            font-size: 28px;
            letter-spacing: 6px;
            font-weight: bold;
            color: #222;
            background-color: #f0f0f0;
            padding: 12px 24px;
            border-radius: 8px;
            display: inline-block;
          ">
            ${otp}
          </span>
        </div>

        <p>This OTP is valid for <strong>5 minutes</strong>. If you didn’t request this, you can safely ignore this email.</p>

        <p>Stay safe,</p>
        <p><strong>The Ancestropedia Team</strong></p>

        <hr style="margin-top: 30px;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          Need help? <a href="mailto:vermadheeraj945@gmail.com" style="color: #007BFF;">Contact us</a>
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendVerificationMail = async (user) => {
  const otp = generateOtp();

  const mailOptions = {
    from: `"Ancestropedia Team" <${process.env.EMAIL}>`,
    to: user.email,
    subject: "Verify Your Ancestropedia Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img 
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=294,fit=crop,q=95/mjE7lpywOyIq5zKx/ancestropedia-1-mePx4pQ230uGow26.png" 
            alt="Ancestropedia Logo" 
            style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%;" 
          />
        </div>

        <h2 style="text-align: center; color: #007BFF;">Email Verification Required</h2>

        <p>Hello ${user.firstName || "User"},</p>

        <p>Thank you for signing up to <strong>Ancestropedia</strong>.</p>

        <p>Please use the following One-Time Password (OTP) to verify your email address:</p>

        <div style="text-align: center; margin: 30px 0;">
          <span style="
            font-size: 28px;
            letter-spacing: 6px;
            font-weight: bold;
            color: #222;
            background-color: #f0f0f0;
            padding: 12px 24px;
            border-radius: 8px;
            display: inline-block;
          ">
            ${otp}
          </span>
        </div>

        <p>This OTP will expire in <strong>5 minutes</strong>. Enter it on the Ancestropedia verification screen to activate your account.</p>

        <p>If you didn’t create an account, please ignore this email.</p>

        <p>Kind regards,</p>
        <p><strong>The Ancestropedia Team</strong></p>

        <hr style="margin-top: 30px;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          Need help? <a href="mailto:vermadheeraj945@gmail.com" style="color: #007BFF;">Contact us</a>
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  return otp;
};

export const sendReportReviewMail = async (report, user) => {
  const mailOptions = {
    from: `"Ancestropedia Team" <${process.env.EMAIL}>`,
    to: user.email,
    subject: "Ancestropedia Report Review Update",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img 
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=294,fit=crop,q=95/mjE7lpywOyIq5zKx/ancestropedia-1-mePx4pQ230uGow26.png" 
            alt="Ancestropedia Logo" 
            style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%;" 
          />
        </div>
        <h2 style="text-align: center; color: #007BFF;">Report Status Update</h2>
        <p>Hello ${user.firstName || "User"},</p>
        <p>Your submitted report has been reviewed. Here are the details:</p>
        <div style="margin: 24px 0; background: #f4f8fc; padding: 18px; border-radius: 8px;">
          <p><strong>Report ID:</strong> ${report._id}</p>
          <p><strong>Description:</strong> ${report.description}</p>
          <p><strong>Status:</strong> <span style="color: #007BFF; font-weight: bold;">${
            report.status
          }</span></p>
        </div>
        <p>If you have questions or need further assistance, feel free to reply to this email.</p>
        <p>Kind regards,</p>
        <p><strong>The Ancestropedia Team</strong></p>
        <hr style="margin-top: 30px;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          Need help? <a href="mailto:vermadheeraj945@gmail.com" style="color: #007BFF;">Contact us</a>
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
