const GoogleStrategy = require('passport-google-oauth20').Strategy;
const store = require('../services/firestoreStore'); // Corrected import

module.exports = function (passport) {
  // Passport session setup.
  //   To support persistent login sessions, Passport needs to be able to
  //   serialize users into and deserialize users out of the session. Typically,
  //   this will be as simple as storing the user ID when serializing, and
  //   finding the user by ID when deserializing.
  passport.serializeUser((user, done) => {
    done(null, user._id); // Assuming your user object has an _id field
  });

  passport.deserializeUser(async (id, done) => {
    const user = await store.findUserById(id); // Assuming you have a findUserById method in your store
    done(null, user);
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;

          // Use Google profile ID as Firebase Auth UID for Firestore document ID
          const uid = profile.id;
          let user = await store.findUserByEmail(email); // This will now return user with _id = uid

          if (!user) {
            user = await store.createUser({ // Pass uid to createUser
              email,
              googleId: profile.id // Store googleId for reference
            }, uid); // Explicitly pass the UID

            await store.createProfile({
              user_id: user._id,
              full_name: profile.displayName,
              avatar_url: profile.photos?.[0]?.value || ''
            });

            await store.createSettings({
              user_id: user._id
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // IMPORTANT: Verify your .env variables and Google Cloud Console settings.
  // - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must match Google Cloud Console.
  // - GOOGLE_CALLBACK_URL must exactly match one of the "Authorized redirect URIs"
  //   in Google Cloud Console (e.g., http://localhost:5000/api/auth/google/callback).
  // - Firebase credentials in .env must be correctly configured.
};
