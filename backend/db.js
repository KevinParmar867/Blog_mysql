import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default {
    dialect: process.env.DIALECT,
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_DATABASE
}