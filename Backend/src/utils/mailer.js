import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.COMPANY_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const mailer = async (receiverEmail, code) => {
  try {
    await transporter.sendMail({
      from: `<${process.env.COMPANY_EMAIL}>`,
      to: receiverEmail,
      subject: "OTP From Teacher-Forum",
      text: `Your OTP code is ${code}`,
      html: `<p>Your OTP code is <b>${code}</b></p>`,
    });

    return true;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    return false;
  }
};

export { mailer };
