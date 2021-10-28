import "../styles/globals.css";
import "../styles/bootstrap.css";
import "../styles/fonts.css";
import "../styles/style.css";
import type { AppProps } from "next/app";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";
import { useAuthStore } from "../store/auth";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";
import { createTheme, ThemeProvider } from "@mui/material";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message }) => {
      if (message == "Unauthenticated.") {
        window.alert(
          "Terdeteksi kesalahan autentikasi di akun anda mohon login ulang"
        );
      }
    });
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const uploadLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const { token } = useAuthStore.getState();
  // return the headers to the context so httpLink can read them

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(errorLink).concat(uploadLink as unknown as ApolloLink),
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          ...[
            "classrooms",
            "videos",
            "users",
            "pages",
            "comments",
            "likes",
          ].reduce((o, key) => ({ ...o, [key]: relayStylePagination() }), {}),
        },
      },
    },
  }),
});

const theme = createTheme({});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default MyApp;
