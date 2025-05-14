import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import getTheme from './theme/theme';
import AppRoutes from './router/AppRoutes';
import Header from './components/Header';
import React from 'react';

function App() {
  const [mode, setMode] = React.useState('dark');
  const theme = getTheme(mode);
  const toggleMode = () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header mode={mode} toggleMode={toggleMode} />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;