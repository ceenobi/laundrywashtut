import { sendMail } from "../utils/mail.js";
import {
  welcomeTemplate,
  resetPasswordTemplate,
  bookingTemplate,
} from "../utils/emailTemplate.js";

const mailService = {
  sendRegistrationMail: async (user, verifcationLink) => {
    const emailBody = welcomeTemplate(user.fullname, verifcationLink);
    await sendMail({
      to: user.email,
      subject: "Verify your account",
      html: emailBody,
    });
  },
  sendPasswordMail: async (user, passwordLink) => {
    const emailBody = resetPasswordTemplate(user.fullname, passwordLink);
    await sendMail({
      to: user.email,
      subject: "Reset Password",
      html: emailBody,
    });
  },
  sendBookingConfirmation: async (user, booking) => {
    const emailBody = bookingTemplate(user.fullname, booking);
    await sendMail({
      to: user.email,
      subject: "Booking Confirmation",
      html: emailBody,
    });
  },
};

export default mailService;
