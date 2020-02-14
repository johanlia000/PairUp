import React from 'react';
import './App.css';
import { Button } from "reactstrap";



function App() {
  return (
    <div className="App">
      <Header />
      <Footer />
    </div>
  );
}


function Header() {
  return <div className='header'>
    <div className = "left-header">
      <div className='logo'>
        <img className = 'logoPic' src="/Photos/logo.png" alt="PairUp Logo"/>
      </div>
      <div className='title'>PairUp</div>
    </div>
    <div className="right-header">
      <Button className="btn-icon btn-2" color="primary" type="button">
          <span className="btn-inner--icon">
            <i className="ni ni-fat-add" />
          </span>
        </Button>
    </div>
  </div>
}

function Footer() {
  return <div className='footer'>
  </div>
}







export default App;
