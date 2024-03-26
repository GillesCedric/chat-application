declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      REVERSE_PORT: number;
      REVERSE_URL: string;
      // add more environment variables and their types here
    }
  }
}