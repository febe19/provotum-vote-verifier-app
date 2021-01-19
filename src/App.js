import React from 'react';
import './App.css';
import Header from './Components/Header.js';
import ScannerComponent from "./Components/ScannerComponent.js";
import Result from './Components/Result.js';
import Intro from './Components/Intro.js';
import NotFound from './Components/NotFound.js';
import { Route, Switch } from 'react-router-dom';


function App() {
  return (
    <main >
      <Header></Header>
      <Switch>
        <Route path="/" component={Intro} exact />
        <Route path="/scanner" component={ScannerComponent} />
        <Route path="/result" component={Result} />
        <Route component={NotFound} />
      </Switch>
    </main>
  );
}

export default App;
