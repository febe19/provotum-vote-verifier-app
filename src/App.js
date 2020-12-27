import React from 'react';
import './App.css';
import Header from './Components/Header.js';
import Scanner from './Components/Scanner.js'

function App() {
  return (
    <div >
      <Header></Header>
      <p1>Hello This is a test</p1>
      <div id="scanner"></div>
      <Scanner />
    </div>
  );
}

export default App;
