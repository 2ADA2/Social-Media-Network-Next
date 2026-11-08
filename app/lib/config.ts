const isServer = typeof window === "undefined";

export const API_URL = isServer
  ? (process.env.API_URL ?? "http://localhost:4000/api")
  : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api");
