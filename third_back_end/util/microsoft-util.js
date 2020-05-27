const config = require('dotenv').config().parsed;
const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

async function signInComplete(iss, sub, profile, accessToken, refreshToken, params, done) {
    if (!profile.oid) {
      return done(new Error("No OID found in user profile."));
    }
    return done(null, users[profile.oid]);
  }

 //  Configure OIDC strategy
  passport.use(new OIDCStrategy(
    {
      identityMetadata: `${config.MICROSOFT_AUTHORITY}${config.MICROSOFT_ID_METADATA}`,
      clientID: config.MICROSOFT_APP_ID,
      responseType: 'code id_token',
      responseMode: 'form_post',
      redirectUrl: config.MICROSOFT_REDIRECT_URI,
      allowHttpForRedirectUrl: true,
      clientSecret: config.MICROSOFT_SECRET,
      validateIssuer: false,
      passReqToCallback: false,
      scope: config.MICROSOFT_SCOPES.split(' ')
    },
    signInComplete
  ));