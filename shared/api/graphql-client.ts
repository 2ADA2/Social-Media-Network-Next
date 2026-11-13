import { API_URL } from "@/app/lib/config";
import { GraphQLClient } from "graphql-request";
import { getCookie } from "../lib/get-cookie";

export const graphqlClient = new GraphQLClient(`${API_URL}/graphql`, {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  requestMiddleware: (request) => {
    const token = getCookie("token");

    if (token) {
      request.headers = {
        ...(request.headers as Record<string, string>),
        Authorization: `Bearer ${token}`,
      };
    }

    return request;
  },
});
