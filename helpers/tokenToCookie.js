const { env } = require("../config");

function tokenToCookie(res, response) {
  if (env === "dev") {
    return res.cookie("token", response.token).json(response);
  } else {
    return res
      .cookie("token", response.token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json(response);
  }
}

module.exports = tokenToCookie;
