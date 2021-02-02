import React, { useRef, useEffect } from 'react';
import Header from './Components/Header';
import Scanner from "./Components/Scanner";
import Result from './Components/Result';
import Intro from './Components/Intro';
import NotFound from './Components/NotFound';
import { Route, Switch } from 'react-router-dom';
import { useDispatch } from "react-redux"
import {
  RAT
} from './Redux/Reducer'


function App() {
  const dispatch = useDispatch()
  const headerRef: any = useRef(null);
  const bodyRef: any = useRef(null);
  var usableHeight: number = 0

  console.log("App Ready")

  useEffect(() => {
    const resizeHandler = () => {
      usableHeight = window.innerHeight - headerRef.current!.clientHeight;  
      dispatch({
        type: RAT.WINDOWHEIGHT,
        payload: usableHeight
      })
    }
    resizeHandler()
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    }
  }, [])
    
  return (
    <main >
      <div ref={headerRef}>
        <Header />
      </div>

      <div ref={bodyRef}>
        <Switch>
          <Route path="/" component={Intro} exact />
          <Route path="/scanner" component={Scanner} />
          <Route path="/result" component={Result} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </main>
  );
}

export default App;
