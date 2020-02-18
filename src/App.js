import React, {useState} from 'react';
import './App.css';
import { Button } from "reactstrap";
// reactstrap components
import {
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup
} from "reactstrap";


function App() {
  return (
    <div className="App">
      <Header />
      <Footer />
      <SearchBar />
      <TripCards />
      
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
      <Button 
        className="btn-icon btn-2" 
        color='info' 
        type="button"
        onClick={()=> {
          console.log('clicked + button')
        }}
      >
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


function SearchBar(props){
  var [text, setText] = useState('')
  return <div className='search-bar'>
    <FormGroup>
      <InputGroup className="mb-4">
        <Input 
          placeholder="Search" 
          type="text" 
          value={text} 
          onChange={e=> setText(e.target.value)}
          onKeyPress={e=> {
            if(e.key ==='Enter') {
              console.log(text)
              setText('')
            }
          }}
        />

        <InputGroupAddon addonType="append">
          <InputGroupText style={{backgroundColor: "#f5365c"}}
            onClick={()=> {
              if(text) 
                console.log(text)
                setText('')
              }}
          >
            <i className="ni ni-zoom-split-in" style={{color: "white"}}/>
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </FormGroup>
  </div>
}


function TripCards(){
  return <div className='trips'>
    <div className='trip-card'>
      <div className='trip-text-box'>
        <div className='trip-text'>
          Trip Match 1
        </div>
      </div>
    </div>

    <div className='trip-card'>
      <div className='trip-text-box'>
        <div className='trip-text'>
          Trip Match 2
        </div>
      </div>
    </div>

    <div className='trip-card'>
      <div className='trip-text-box'>
        <div className='trip-text'>
          Trip Match 3
        </div>
      </div>
    </div>


    <div className='trip-card'>
      <div className='trip-text-box'>
        <div className='trip-text'>
          Trip Match 4
        </div>
      </div>
    </div>

    <div className='trip-card'>
      <div className='trip-text-box'>
        <div className='trip-text'>
          Trip Match 5
        </div>
      </div>
    </div>
    
  </div>
}




export default App;
