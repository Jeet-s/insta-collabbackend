const passport = require("passport");
const requireLogin = require("../middlewares/requireLogin");

module.exports = (app) => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  // app.get(
  //   "/auth/google/callback",
  //   passport.authenticate("google", {
  //     successRedirect: "http://localhost:4200",
  //     failureRedirect: "http://localhost:4200",
  //   })
  // );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login",
      successRedirect: "http://localhost:3000/profile",
      failureMessage: true,
    }),
    function (req, res) {
      res.redirect("http://localhost:3000/profile");
    }
  );

  app.get("/auth/logout", (req, res) => {
    req.logout();
    res.redirect("http://localhost:3000/");
  });

  app.get("/api/current_user", requireLogin, (req, res) => {
    res.send(req.user);
  });
};
