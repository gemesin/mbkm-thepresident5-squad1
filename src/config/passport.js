const passport = require('passport');
const db = require('../models');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await db.userModel.findOne({ where: { id: jwt_payload.id } });
    
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
}));
  
module.exports = passport;