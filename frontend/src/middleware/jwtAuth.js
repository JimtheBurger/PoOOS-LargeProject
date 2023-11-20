const jwt = require("jsonwebtoken");

exports.jwtAuth = (req, res, next) => {
  const token = req.cookies.token;

  try {
    const val = jwt.verify(token, process.env.JSON_SECRET);
    req.Username = val.Username;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res
      .status(200)
      .json({ Error: "Login Session Invalid: Please Login" });
  }
};
