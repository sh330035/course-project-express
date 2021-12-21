const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
// 因為在 route 資料夾有設定 index 管理
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
const { course } = require("./routes");
require("./config/passport")(passport);
const cors = require("cors");

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect to Mongo Altas");
  })
  .catch((e) => {
    console.log(e);
  });

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// 一定要加/api，讓前後端溝通順利，避免麻煩
app.use("/api/user", authRoute);
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

//server
//因為react預設會在port:3000上面跑，因此server要選別的port
app.listen(8080, () => {
  console.log("Server running on port 8080.");
});
