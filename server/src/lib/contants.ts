export const ACCESS_TOKEN_EXPIRES_IN = "15m";
export const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
export const REFRESH_TOKEN_EXPIRES_IN = "7d";
export const REFRESH_TOKEN_MAX_AGE = 15 * 24 * 60 * 60 * 1000;

export const USERNAME_PATTERN = /^[a-zA-Z0-9._@]+$/;
export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const omitFromUser = {
  password: true,
  verificationCode: true,
  verificationCodeExpiresAt: true,
  resetToken: true,
  resetTokenExpiresAt: true,
};
