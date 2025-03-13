import React, { useMemo, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { CssBaseline, ThemeProvider } from '@mui/material';

import { getDesignTokens } from './styles/theme';
import { ColorModeContext } from './context/ThemeMode';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/routes';

const App = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light')),
    }),
    [mode],
  );

  const theme = useMemo(() => getDesignTokens(mode), [mode]);

  const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || '/graphql',
  });

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('id_token');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <ColorModeContext.Provider value={colorMode}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ThemeProvider>
        </AuthProvider>
      </ColorModeContext.Provider>
    </ApolloProvider>
  );
};

export default App;
