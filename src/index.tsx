import React from 'react';

//local onde a interface é utilizada
//DOM = Document Object Model -> É uma representação do HTML através de um objeto dentro do JavaScript
//HTML dentro do JS => TSX/JSX (x -> XML)
import ReactDOM from 'react-dom';
import App from './App';

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import './services/firebase';

import './styles/global.scss';

//demonstra algo na interface e recebe HTML
ReactDOM.render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>,
  document.getElementById('root') //pega o id do index.html e exibe o que está acima (<App />) lá na página HTML de acordo com o que está no arquivo (App.tsx)
);

serviceWorkerRegistration.register();