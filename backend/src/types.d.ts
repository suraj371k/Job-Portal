/// <reference types="node" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      MONGODB_URI: string;
      JWT_SECRET: string;
      SESSION_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      EMAIL_USER: string;
      EMAIL_PASS: string;
      FRONTEND_URL?: string;
    }
  }
}

export {}; 