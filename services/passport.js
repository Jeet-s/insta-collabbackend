const passport = require("passport");
var GoogleStrategy = require("passport-google-oidc");
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("User");

passport.serializeUser((user, done) => {
  console.log("user 1 => ", user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    console.log("user 2 => ", user);
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/google/callback",
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      proxy: true,
    },
    async (issuer, profile, done) => {
      console.log("GOOGLE LOGIN PROFILE", profile, issuer);
      try {
        const existingUser = await User.findOne({ googleId: profile.id });
        console.log("EXISTING USER", existingUser);
        if (existingUser) {
          return done(null, existingUser);
        }
        const user = await new User({
          googleId: profile.id,
          displayName: profile.displayName,
        }).save();

        console.log("NEW USER", user);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
