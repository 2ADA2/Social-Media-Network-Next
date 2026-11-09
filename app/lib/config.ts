const isServer = typeof window === "undefined";

const ENV_API_URL = isServer
  ? (process.env.API_URL ?? "http://localhost:4000/api")
  : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api");

export const API_URL = ENV_API_URL.endsWith("/api")
  ? ENV_API_URL
  : ENV_API_URL + "/api";
