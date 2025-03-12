import jwt from "jsonwebtoken";

export const genarateToken = (res, user, message) => {
  const token = jwt.sign(
    {
      userId: user?._id,
      role: user?.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_TIME }
  );
  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: strict,
      maxAge: process.env.JWT_EXPIRES_TIME,
    })
    .json({
      status: "success",
      message,
      token,
      user,
    });
};
