import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT ?? 3000;
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const SALT_ROUNDS = IS_DEVELOPMENT ? 1 : 10;

export { PORT, IS_DEVELOPMENT, SALT_ROUNDS };
