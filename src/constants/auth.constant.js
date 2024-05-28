import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const JWT_EXPIRATION = '12h';
export const REFRESH_TOKEN_EXPIRATION = '7d';
