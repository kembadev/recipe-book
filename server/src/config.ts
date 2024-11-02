process.loadEnvFile();

const PORT = process.env.PORT ?? 3000;
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const SALT_ROUNDS = IS_DEVELOPMENT ? 1 : 10;
const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;

export { PORT, IS_DEVELOPMENT, SALT_ROUNDS, SECRET_JWT_KEY };
