export enum ConfigVariables {
  NodeEnv = 'NODE_ENV',
  CorsAllowedOrigins = 'CORS_ALLOWED_ORIGINS',
  WhitelistedIps = 'WHITELISTED_IPS',
  ClientUri = 'CLIENT_URI',
  ServerUri = 'SERVER_URI',
  ServerIp = 'SERVER_IP',
  UserPasswordSaltPrefix = 'USER_PASSWORD_SALT_PREFIX',
  UserPasswordSaltSuffix = 'USER_PASSWORD_SALT_SUFFIX',
  UserPasswordSaltRounds = 'USER_PASSWORD_SALT_ROUNDS',
  DatabaseHost = 'DATABASE_HOST',
  DatabasePort = 'DATABASE_PORT',
  DatabaseUsername = 'DATABASE_USERNAME',
  DatabasePassword = 'DATABASE_PASSWORD',
  DatabaseName = 'DATABASE_NAME',
  DatabaseSchema = 'DATABASE_SCHEMA',
  DatabaseType = 'DATABASE_TYPE',
  DatabaseUrl = 'DATABASE_URL',
  CookieAccessTokenName = 'COOKIE_ACCESS_TOKEN_NAME',
  CookieRefreshTokenName = 'COOKIE_REFRESH_TOKEN_NAME',
  CookieDomain = 'COOKIE_DOMAIN',
  CookieSecret = 'COOKIE_SECRET',
  JwtSecret = 'JWT_SECRET',
  JwtAccessTokenDuration = 'JWT_ACCESS_TOKEN_DURATION',
  JwtRefreshTokenDuration = 'JWT_REFRESH_TOKEN_DURATION',
  JwtIssuer = 'JWT_ISSUER',
  JwtAudience = 'JWT_AUDIENCE',
  DefaultLogLevel = 'DEFAULT_LOG_LEVEL',
}

export enum Routes {
  Auth = 'auth',
  Users = 'users',
  Orders = 'orders',
}

export enum LogLevels {
  ERROR = 'error',
  WARNING = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}
