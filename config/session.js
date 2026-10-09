const session = require("express-session");

const isProduction = process.env.NODE_ENV === "production";

const sessionConfig = session({
  name: "pallavi_pal_admin_session",

  secret: process.env.SESSION_SECRET,

  resave: false,

  saveUninitialized: false,

  rolling: true,

  cookie: {
    httpOnly: true,

    secure: isProduction,

    sameSite: "lax",

    maxAge: 24 * 60 * 60 * 1000,

    path: "/",
  },
});

module.exports = sessionConfig;