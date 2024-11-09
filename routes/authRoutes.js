const passport = require("passport");

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
      successRedirect: "http://localhost:3000",
      failureMessage: true,
    }),
    function (req, res) {
      res.redirect("http://localhost:3000");
    }
  );

  app.get("/auth/logout", (req, res) => {
    req.logout();
    res.redirect("http://localhost:3000");
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
};
