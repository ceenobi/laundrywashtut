import jwt from "jsonwebtoken";

export const signToken = (id, role) => {
  const accessToken = jwt.sign(
    { id, role },
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES,
    }
  );
  const refreshToken = jwt.sign(
    { id, role },
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES,
    }
  );
  return { accessToken, refreshToken };
};

export const sendToken = (user) => {
  if (!user) return;
  const token = signToken(user._id, user.role);
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
    sameSite: isProduction ? "none" : "lax",
  };
  return {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    cookieOptions,
  };
};
