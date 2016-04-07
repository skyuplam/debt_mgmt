import passport from 'passport';
import localSignInStrategy from './local/local-sign-in-strategy';
import bearerStrategy from './bearer/bearer';

passport.use(localSignInStrategy);
passport.use(bearerStrategy);

// serialising and deserialising user objects
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
