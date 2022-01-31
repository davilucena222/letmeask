import React from 'react';
import {ThemeProvider, DefaultTheme} from 'styled-components';
import usePersistedState from './hooks/usePersistedState';

import light from './styles/themes/light';
import dark from './styles/themes/dark';

import GlobalStyle from './styles/global';
import SwitchThemeColor from './components/switcher/SwitchColor';

import {BrowserRouter, Route, Switch} from 'react-router-dom';

import {Home} from "./pages/Home";
import {NewRoom} from "./pages/NewRoom";
import { Room } from './pages/Room';

import {AuthContextProvider} from './contexts/AuthContext';
import { AdminRoom } from './pages/AdminRoom';

function App() {
//quando se envia um conteúdo por dentro de um componente ele se torna uma propriedade que é chamada de children

//caso uma rota seja acessada o Switch para de procurar por outras rotas
  const [theme, setTheme] = usePersistedState<DefaultTheme>('theme', light);

   const toggleTheme = () => {
     setTheme(theme.title === 'light' ? dark : light);
   };

  return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <GlobalStyle/>
          <SwitchThemeColor toggleTheme={toggleTheme}/>
        </div>  
        <BrowserRouter>
          <AuthContextProvider>
            <Switch> 
              <Route path="/" exact component={Home} />
              <Route path="/rooms/new" component={NewRoom} />
              <Route path="/rooms/:id" component={Room} />
              <Route path="/admin/rooms/:id" component={AdminRoom} />
            </Switch>
          </AuthContextProvider>
        </BrowserRouter>
      </ThemeProvider>
  );
}

export default App;