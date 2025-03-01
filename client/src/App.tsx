import { Outlet } from 'react-router-dom';
// import { useState } from "react";
import logo from "./assets/images/logo.png"
import Navbar from "./components/Navbar";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import getTheme from './components/ThemeMode';
import { createContext, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';

export const ColorModeContext = createContext<{ mode: "light" | "dark"; toggleColorMode: () => void }>({
  mode: "light",
  toggleColorMode: () => {},
});

const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const colorMode = useMemo(
    () => ({
      mode, // Ensure mode is included in the context
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    [mode] // Depend on mode so it updates properly
  );
  
  return (
    <ApolloProvider client={client}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={getTheme(mode)}>
          <CssBaseline />          
          <Navbar
            logo={logo}
            logoSize={100}
            links={[{ label: "Home", path: "/" }]}
          />
          <Outlet />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </ApolloProvider>
  );
}

export default App;
