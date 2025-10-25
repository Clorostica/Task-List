declare namespace NodeJS {
  interface ProcessEnv {
    AUTH0_JWKS_URI: string;
    AUTH0_AUDIENCE: string;
    AUTH0_ISSUER: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_HOST: string;
    POSTGRES_PORT: number;
    POSTGRES_DB: string;
  }
}
