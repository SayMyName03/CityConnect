import passport from '../src/config/passport.js';

// passport._strategy is internal; use passport._strategies to inspect registered strategies
console.log('Registered strategies:', Object.keys(passport._strategies || {}));

// Provide helpful hint
if (!passport._strategies || Object.keys(passport._strategies).length === 0) {
  console.warn('No strategies registered. Ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in the environment and that passport config imports after dotenv.');
}
