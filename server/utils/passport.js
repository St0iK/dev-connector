const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../../config/keys");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secretOrKey,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      const user = await User.findById(jwtPayload.id).exec();
      if (!user) {
        console.log("no user found for id");
        return done(null, false);
      }
      console.log("returning user");
      console.log({ user });
      return done(null, user);
    })
  );
};
