import jwt from "jsonwebtoken";

const generateToken = (user) => {
  if (!user || !user._id) {
    throw new Error("Invalid user object passed to generateToken function.");
  }

  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRE;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  if (!expiresIn) {
    throw new Error("JWT_EXPIRE is not defined in environment variables.");
  }

  return jwt.sign({ _id: user._id }, secret, {
    expiresIn,
  });
};

export default generateToken;
