const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require("./config/keys");
const cors = require("cors");

require("./models/User");
require("./models/RateCard");
require("./services/passport");

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI);

const app = express();

// app.options("*", cors());
// app.use(cors());

const corsOptions = {
  origin: "http://localhost:3000", // Frontend origin
  credentials: true, // Enable cookies for cross-origin requests
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/promotionsRoutes")(app);

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`Listening on port`, PORT);
});
