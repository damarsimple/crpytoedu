import "../styles/globals.css";
import "../styles/bootstrap.css";
import "../styles/fonts.css";
import "../styles/style.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
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
import {
  Box,
  Button,
  createTheme,
  Modal,
  ThemeProvider,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useModalStore } from "../store/modal";
// When using TypeScript 4.x and above
import type {} from "@mui/lab/themeAugmentation";

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
  const { open, close, message, next } = useModalStore();
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </Head>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
          <Modal open={open} onClose={close}>
            <Box
              sx={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 600,
                boxShadow: 24,
                backgroundColor: "white",
                p: 4,
              }}
            >
              <Typography>{message}</Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => next && next() && close()}
                >
                  Yes
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="warning"
                  onClick={close}
                >
                  No
                </Button>
              </Box>
            </Box>
          </Modal>
        </ThemeProvider>
        <ToastContainer position="bottom-right" />
      </ApolloProvider>
    </>
  );
}

export default MyApp;
