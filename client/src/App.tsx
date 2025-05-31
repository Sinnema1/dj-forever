import React, { useMemo, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { CssBaseline, ThemeProvider } from '@mui/material';

import client from './apolloClient';
import AppRoutes from './routes/routes';
import { getDesignTokens } from './styles/theme';
import { ColorModeContext } from './context/ThemeMode';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  const [mode, setMode] = useState<'light'|'dark'>('light');

  const colorMode = useMemo(() => ({
    mode,
    toggleColorMode: () => setMode(m => m === 'light' ? 'dark' : 'light'),
  }), [mode]);

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