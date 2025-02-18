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

const testGroupRoutes = require("./routes/testGroupRoutes");
const testRoutes = require("./routes/testRoutes");
const scenarioRoutes = require("./routes/scenarioRoutes");
const resultRoutes = require("./routes/resultRoutes");

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
// require("./routes/testGroupRoutes")(app);
// require("./routes/testRoutes")(app);
// require("./routes/scenarioRoutes")(app);
// require("./routes/resultRoutes")(app);
app.use("/test_group", testGroupRoutes);
app.use("/test", testRoutes);
app.use("/scenario", scenarioRoutes);
app.use("/result", resultRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port`, PORT);
});

//jagjeetsingh2019
//XzSqR63HXFYU51N9
