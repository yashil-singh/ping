import nodemailer from "nodemailer";
import { MAIL_PASS, MAIL_USER } from "../env";

const sendEmail = async ({
  to,
  subject,
  html,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; path: string; cid: string }[];
}) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: MAIL_USER,
      to,
      subject,
      html,
      attachments,
    });

    return true;
  } catch (error) {
    return false;
  }
};

export default sendEmail;
