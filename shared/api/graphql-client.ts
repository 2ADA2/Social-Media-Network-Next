import { GraphQLClient } from 'graphql-request';

export const graphqlClient = new GraphQLClient(
  `${window.location.origin}/api/graphql`,
  {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    requestMiddleware: (request) => {
      const token = localStorage.getItem('token');

      if (token) {
        request.headers = {
          ...(request.headers as Record<string, string>),
          Authorization: `Bearer ${token}`,
        };
      }

      return request;
    },
  },
);
