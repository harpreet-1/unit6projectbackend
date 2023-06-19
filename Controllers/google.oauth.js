const express = require("express");
const session = require("express-session");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/user");
require("./auth");

const googleRouter = express.Router();
require("dotenv").config();

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

googleRouter.use(
  session({ secret: "cats", resave: false, saveUninitialized: true })
);
googleRouter.use(passport.initialize());
googleRouter.use(passport.session());

googleRouter.get("/", (req, res) => {
  res.send('<a href="/auth/google">Sign up with Google</a>');
});

googleRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

googleRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/google/failure",
  })
);

googleRouter.get("/protected", isLoggedIn, async (req, res) => {
  console.log("user", req.user._json);

  try {
    let email = req.user._json.email;
    let user = await UserModel.findOne({ email });
    //console.log(user)

    if (!user) {
      console.log("adding new user");
      let newuser = new UserModel({
        email,
        name: req.user._json.name,
        password: "12345678",

        emailVerified: true,
      });

      await newuser.save();
      user = newuser;
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });
    res.send(`<a href="https://pear-splendid-bee.cyclic.app/users" id="myid" style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #222222; margin: 0; padding: 0; overflow: scroll;">
                      <img src="https://mir-s3-cdn-cf.behance.net/project_modules/hd/b6e0b072897469.5bf6e79950d23.gif" alt="">
                  </a>
                  <script>
                  localStorage.setItem("token", ${JSON.stringify(token)});
                      let a = document.getElementById('myid')
                      setTimeout(()=>{
                          a.click()
                      },2000)
                      console.log(a)
                  </script>
          `);
  } catch (error) {
    console.log(error);
  }

  //console.log(profile)
});

googleRouter.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("Goodbye!");
});

googleRouter.get("/auth/google/failure", (req, res) => {
  res.send("Failed to authenticate..");
});

// googleRouter.listen(process.env.PORT, () =>
//   console.log(`listening on port: ${process.env.PORT}`)
// );

module.exports = googleRouter;
