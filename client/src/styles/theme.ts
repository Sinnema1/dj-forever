import { createTheme, Theme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

export const getDesignTokens = (mode: PaletteMode): Theme => {
  return createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light mode palette
            primary: {
              main: '#1976d2',
            },
            secondary: {
              main: '#9c27b0',
            },
            background: {
              default: '#f5f5f5',
              paper: '#ffffff',
            },
          }
        : {
            // Dark mode palette
            primary: {
              main: '#90caf9',
            },
            secondary: {
              main: '#ce93d8',
            },
            background: {
              default: '#121212',
              paper: '#1d1d1d',
            },
          }),
    },

    typography: {
      fontFamily: 'Roboto, sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
      },
      body1: {
        fontSize: '1rem',
      },
      body2: {
        fontSize: '0.875rem',
      },
      button: {
        textTransform: 'none',
      },
    },
  });
};
