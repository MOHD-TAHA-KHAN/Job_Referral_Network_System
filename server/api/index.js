const serverless = require('serverless-http');

// Import the compiled Express app from dist.
// Vercel will run `npm run build` (tsc) during the build step, producing server/dist/app.js
// which exports the Express `app` as the default export (app.ts: `export default app`).
let app;
try {
  app = require('../dist/app').default || require('../dist/app');
} catch (err) {
  // If dist is not present at runtime, provide a helpful error
  console.error('Failed to require ../dist/app. Ensure TypeScript is compiled (npm run build) during Vercel build. Error:', err);
  throw err;
}

module.exports = serverless(app);
