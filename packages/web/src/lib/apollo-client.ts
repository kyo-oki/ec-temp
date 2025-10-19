import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

// Create HTTP link
const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql",
});

// Create auth link to add JWT token to requests
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("auth-token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create error link for handling GraphQL errors
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);

      // Handle 401 errors by clearing token and redirecting to login
      if ("statusCode" in networkError && networkError.statusCode === 401) {
        localStorage.removeItem("auth-token");
        window.location.href = "/signin";
      }
    }
  }
);

// Create Apollo Client instance
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          blogPosts: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          faqs: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          promotions: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});
