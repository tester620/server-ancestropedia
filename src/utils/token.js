import jwt  from "jsonwebtoken";
const isProd = process.env.NODE_ENV === "production";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_KEY, {
    expiresIn: "7d",
  });

    res.cookie("jwt", token, {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: "None",
  secure: true,

});
  return token;
};
