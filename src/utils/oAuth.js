// import {GoogleStrategy} from "passport-google-oauth20";

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "/auth/google/callback",
//     scope: ['profile', 'email']
//   },
//   (accessToken, refreshToken, profile, done) => {
//     // User data returned from Google
//     return done(null, profile);
//   }
// ));

// passport.serializeUser((user, done) => done(null, user));
// passport.deserializeUser((user, done) => done(null, user));

// app.get('/auth/google', passport.authenticate('google'));
// app.get('/auth/google/callback', 
//   passport.authenticate('google', { 
//     successRedirect: `${process.env.FRONTEND_URL}`,
//     failureRedirect: `${process.env.FRONTEND_URL}/login/`
//   })
// );

// // Check authentication
// app.get('/auth/user', (req, res) => {
//   if (req.user) res.json({ user: req.user });
//   else res.status(401).json({ error: "Unauthorized" });
// });

// // Logout
// app.get('/auth/logout', (req, res) => {
//   req.logout(() => {
//     res.redirect(process.env.FRONTEND_URL);
//   });
// });