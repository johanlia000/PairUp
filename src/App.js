import React, {useState, useEffect} from 'react';
import './App.css';
import { Button } from "reactstrap";
import firebase from "firebase/app";
import "firebase/auth";


// reactstrap components
import {
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Card,
  CardHeader,
  CardBody,
  Form,
  Modal,
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

function LoginButton(){
  const [modalOpen, setModalOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function login(){
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      console.log(error)
    });    
  }
  return <div>
    <Button
      block
      color="secondary"
      type="button"
      onClick={() => setModalOpen(true)}
    >
      Login
    </Button>
    <Modal
      className="modal-dialog-centered"
      size="sm"
      isOpen={modalOpen}
      toggle={() => setModalOpen(!modalOpen)}
    >
      <div className="modal-body p-0">
        <Card className="bg-secondary shadow border-0">
 
          <CardBody className="px-lg-5 py-lg-5 cardBody">
            <div className="signIn">
              <small>Sign In</small>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText style={{backgroundColor: "#f5365c"}}>
                      <i className="ni ni-email-83" style={{color: "white"}}/>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input 
                    placeholder="Email" 
                    type="email" 
                    value={email} 
                    onChange={e=> setEmail(e.target.value)}
                    onKeyPress={e=> {
                      if(e.key ==='Enter') {
                          console.log(email)
                        setEmail('')
                      }
                    }}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText style={{backgroundColor: "#f5365c"}}>
                      <i className="ni ni-lock-circle-open" style={{color: "white"}}/>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="Password" type="password" />
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                <Button
                  className="my-4"
                  color="info"
                  type="button"
                >
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </div>
    </Modal>
  </div>
}

function Header(props) {
  return <div className='header'>
    <div className = "left-header">
      <div className='logo'>
        <img className = 'logoPic' src="/Photos/logo.png" alt="PairUp Logo"/>
      </div>
      <div className='title'>PairUp</div>
    </div>

    <div className="right-header">
      <LoginButton/>
      {/* <Button 
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
      </Button> */}
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
