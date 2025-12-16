import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  requireTLS: true, //upgrade to secure conn once connected
  auth: {
    user: process.env.GOOGLE_APP_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
  tls: {
    //reject unauthorized cert in prod env, for security
    rejectUnauthorized: process.env.NODE_ENV === "production",
  },
});

//verify email service connection
const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("Email service connection verified");
  } catch (error) {
    console.error("Failed to connect to email service", {
      error: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
    throw new Error("Email service connection failed");
  }
};
verifyEmailConnection().catch(console.error);

export const sendMail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: "LAUNDRYWASH <laundrywash@gmail.com",
    to,
    subject,
    html,
  };
  try {
    const res = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully", res.messageId);
  } catch (error) {
    console.error("Error sending email:", {
      error: error.message,
      code: error.code,
      stack: error.stack,
    });
  }
};
