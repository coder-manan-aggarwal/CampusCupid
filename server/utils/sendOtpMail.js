import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpMail = async (email, otp) => {
  try {
    await resend.emails.send({
      from: "CampusCupid <onboarding@ccupid.xyz>",
      to: email,
      subject: "Your CampusCupid OTP 💖",
      html: `<h2>Your OTP is ${otp}</h2>`,
    });
  } catch (err) {
    console.log("Mail error:", err);
    throw err;
  }
};