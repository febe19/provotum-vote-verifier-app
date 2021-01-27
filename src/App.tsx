import React from 'react';
import Header from './Components/Header';
import ScannerComponent from "./Components/ScannerComponent";
import Result from './Components/Result';
import Intro from './Components/Intro';
import NotFound from './Components/NotFound';
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
