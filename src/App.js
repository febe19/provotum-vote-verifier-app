import React from 'react';
import './App.css';
import Header from './Components/Header.js';
import Scanner from './Components/Scanner.js';
import Intro from './Components/Intro.js';
import NotFound from './Components/NotFound.js';


import { Route, Switch } from 'react-router-dom';


function App() {
  return (
    <main >
      <Header></Header>
      <Switch>
        <Route path="/" component={Intro} exact />
        <Route path="/scanner" component={Scanner} />
        <Route component={NotFound} />
      </Switch>
    </main>
  );
}

export default App;
