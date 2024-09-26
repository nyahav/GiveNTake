import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const envVariables = ['DB_ATLAS_URI', 'API_VERSION', 'ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'S3_REGION', 'S3_BUCKET', 'VITE_FORWARDED_ADDRESS','RESEND_API_KEY' ];

// auto generate config object
const config = {};
for (const variable of envVariables) {
  config[variable] = process.env[variable];
}

export const { S3_REGION, S3_BUCKET, DB_ATLAS_URI, API_VERSION, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, VITE_FORWARDED_ADDRESS, RESEND_API_KEY} = config;