import React from 'react';
import {AppContainer} from "./containers/AppContainer";
import { ThemeProvider } from 'styled-components';
import {BlueTheme} from "./theme/BlueTheme";

const App = () => {
  return (
      <ThemeProvider theme={BlueTheme}>
        <AppContainer/>
      </ThemeProvider>
  );
};

export default App;
