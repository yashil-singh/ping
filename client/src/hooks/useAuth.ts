import { ErrorResponse, get, patch, post } from "@/lib/api";
import {
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  verifyAccountSchema,
} from "@/lib/schemas/authSchema";
import { z } from "zod";
import { handleError } from "@/lib/api";
import { AxiosError } from "axios";

const BASE = "/auth";

export const signup = async (values: z.infer<typeof signupSchema>) => {
  try {
    const data = await post(`${BASE}/signup`, values);

    return { success: true, data };
  } catch (error) {
    const { message, errors } = handleError(error as AxiosError<ErrorResponse>);

    return { success: false, errorMessage: message, errors };
  }
};

export const resendVerificationCode = async () => {
  try {
    const data = await post(`${BASE}/resend-verification`);

    return { success: true, data };
  } catch (error) {
    const { message, errors } = handleError(error as AxiosError<ErrorResponse>);

    return { success: false, errorMessage: message, errors };
  }
};

export const verifyAccount = async (
  values: z.infer<typeof verifyAccountSchema>
) => {
  try {
    const data = await patch(`${BASE}/verify-account`, values);

    return { success: true, data };
  } catch (error) {
    const { message, errors } = handleError(error as AxiosError<ErrorResponse>);

    return { success: false, errorMessage: message, errors };
  }
};

export const login = async (values: z.infer<typeof loginSchema>) => {
  try {
    const data = await post(`${BASE}/login`, values);

    return { success: true, data };
  } catch (error) {
    const { message, errors } = handleError(error as AxiosError<ErrorResponse>);

    return { success: false, errorMessage: message, errors };
  }
};

export const getUser = async () => {
  try {
    const data = await get(`${BASE}/user`);

    return { success: true, data };
  } catch (error) {
    const { message, errors } = handleError(error as AxiosError<ErrorResponse>);

    return { success: false, errorMessage: message, errors };
  }
};

export const logout = async () => {
  try {
    const data = await post(`${BASE}/logout`);

    return { success: true, data };
  } catch (error) {
    const { message, errors } = handleError(error as AxiosError<ErrorResponse>);

    return { success: false, errorMessage: message, errors };
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const data = await post(`${BASE}/forgot-password`, { email });

    return { success: true, data };
  } catch (error) {
    const { message, errors } = handleError(error as AxiosError<ErrorResponse>);

    return { success: false, errorMessage: message, errors };
  }
};

export const resetPassword = async (
  values: z.infer<typeof resetPasswordSchema>
) => {
  try {
    const data = await patch(`${BASE}/reset-password`, values);

    return { success: true, data };
  } catch (error) {
    const { message, errors } = handleError(error as AxiosError<ErrorResponse>);

    return { success: false, errorMessage: message, errors };
  }
};
