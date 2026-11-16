import { API_URL } from "@/app/lib/config";
import { GraphQLClient } from "graphql-request";
import { getCookie } from "../lib/get-cookie";

export const graphqlClient = new GraphQLClient(`${API_URL}/graphql`, {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  requestMiddleware: (request) => {
    const token = getCookie("token");

    if (token) {
      const headers = new Headers(request.headers);
      headers.set("Authorization", `Bearer ${token}`);
      request.headers = headers;
    }

    return request;
  },
});
