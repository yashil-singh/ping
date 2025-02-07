import bcrypt from "bcryptjs";
import { MAIL_PASS, MAIL_USER, SALT_ROUNDS } from "./contants";
import nodemailer from "nodemailer";
import { EmailOptions } from "./types";
import randomatic from "randomatic";
import cloudinary from "./cloudinary";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

export const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: MAIL_USER,
      to,
      subject,
      text,
      html,
    });
    console.log("🚀 ~ info:", info);

    return true;
  } catch (error) {
    console.log("🚀 ~ error:", error);

    return false;
  }
};

export const generateRandomNumber = (length: number) => {
  return randomatic("0", length);
};

export const generateRandomString = (length: number) => {
  return randomatic("Aa0", length);
};

export const extractCloudinaryPublicId = (url: string) => {
  return url.split("/").pop()?.split(".")[0];
};

export const deleteImagesFromCloudinary = async (
  url: string,
  folder: string
) => {
  const publicId = extractCloudinaryPublicId(url);
  await cloudinary.uploader.destroy(`ping/${folder}/${publicId}`);
};
