/**
 * Environment Variable Validation
 * Ensures all required env vars are set before app startup
 */

export function validateEnv(): void {
  const requiredEnvVars = [
    'PG_URI',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'CLOUDINARY_URL',
    'CLIENT_URL',
  ];

  const missingVars: string[] = [];

  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    const errorMsg = `❌ Missing required environment variables:\n${missingVars.map(v => `  - ${v}`).join('\n')}\n\nPlease set these variables in .env or your deployment platform.`;
    console.error(errorMsg);
    process.exit(1);
  }

  // Validate JWT_SECRET is strong enough (min 32 chars)
  if ((process.env.JWT_SECRET || '').length < 32) {
    console.warn('⚠️  JWT_SECRET is too short (min 32 characters recommended)');
  }

  // Validate port number if provided
  if (process.env.PORT) {
    const port = parseInt(process.env.PORT, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      console.error(`❌ Invalid PORT: ${process.env.PORT}. Must be between 1-65535`);
      process.exit(1);
    }
  }

  console.log('✓ Environment validation passed');
}
