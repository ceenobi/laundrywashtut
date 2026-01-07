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
  const token = signToken(user._id, user.role); //_id comes from mongodb
  //create a cookie to store refreshToken in order to prevent browser access on client
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true, //cookie is not accessible in javascript
    secure: isProduction, //send cookie over HTTPS only in prod enviroment
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie is valid 7 days
    path: "/", //cookie is accessible on the specified api endpoint
    sameSite: isProduction ? "none" : "lax",
  };
  return {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    cookieOptions,
  };
};
