import React, { useMemo, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ApolloProvider } from '@apollo/client';

import client from './apolloClient'; // Centralized ApolloClient configuration
import { getDesignTokens } from './styles/theme';
import { ColorModeContext } from './context/ThemeMode';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/routes';

const App = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  // Toggle between light and dark mode
  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light')),
    }),
    [mode],
  );

  // Create theme based on current mode
  const theme = useMemo(() => getDesignTokens(mode), [mode]);

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
