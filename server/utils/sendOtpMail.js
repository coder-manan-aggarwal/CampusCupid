import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // VERY IMPORTANT
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpMail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"CampusCupid ❤️" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "CampusCupid Verification OTP",
      html: `
        <div style="font-family:sans-serif">
          <h2>Your OTP is: ${otp}</h2>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    });

    console.log("OTP mail sent");
  } catch (err) {
    console.log("Mail error:", err);
    throw err;
  }
};