import React, {useState, useEffect} from 'react';
import './App.css';
import "./App.css";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AddIcon from '@material-ui/icons/Add';

// reactstrap components
import {
  FormGroup,
  Button,
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
import * as firebase from "firebase/app"
import "firebase/storage"
import { db, queryPlans } from './db'
import "firebase/analytics"
import "firebase/auth";


function App() {
  const [user, setUser] = useState(null)
  useEffect(()=>{
    firebase.auth().onAuthStateChanged(function(user) {
      console.log(user)
      if (user) {
        setUser(user)
      } else {
        // No user is signed in.
        setUser(null)
      }
    });
  }, [])
 

  return (
    <div className="App">
      <Header user={user} />
      <Footer />
      <SearchBar />
    </div>
  );
}

function LoginButton(){
  const [modalOpen, setModalOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  var provider = new firebase.auth.GoogleAuthProvider();

  // Sign up and make user on firebase with email and password
  function signUp(){
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      console.log(error)
    });    
  }

  // Login with email and password
  function loginEmail(){
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  }

  // Login with Google
  function googleLogin(){
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
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
                  <Input 
                    placeholder="Password" 
                    type="password" 
                    value={password}
                    onChange={e=> setPassword(e.target.value)}
                    // onKeyPress={e=> {
                    //   if(e.key ==='Enter' && email && password) {
                    //     console.log(email)
                    //     console.log(password)
                    //     setEmail('')
                    //     setPassword('')
                    //     setModalOpen(false)
                    //     login()
                    //   }
                    // }}
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                <Button
                  className="my-4 signup-button"
                  color="info"
                  type="button"
                  onClick={async ()=> {
                    if(email && password) 
                      console.log(email)
                      console.log(password)
                      setEmail('')
                      setPassword('')
                      setModalOpen(false)
                      signUp() // change this to be sign up
                  }    
                  }
                >
                  Sign Up
                </Button>

                <Button
                  className="my-4"
                  color="info"
                  type="button"
                  onClick={async ()=> {
                    if(email && password) 
                      console.log(email)
                      console.log(password)
                      setEmail('')
                      setPassword('')
                      setModalOpen(false)
                      loginEmail() 
                  }}
                >
                  Login
                </Button>
              </div>
              <div className="text-center">
              <Button
                  className="my-4"
                  color = 'primary'
                  type="button"
                  onClick={async ()=> {
                    if(email && password) 
                      console.log(email)
                      console.log(password)
                      setEmail('')
                      setPassword('')
                      setModalOpen(false)
                      googleLogin() // calls the function given by firebase
                  }    
                  }
                >
                  Google
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
      {!props.user && <LoginButton/>}
      {props.user && <TaskBar/>}
    </div>
  </div>
}

function TaskBar(){
  function logout(){
    firebase.auth().signOut().then(function() {
      console.log('successful logout!')
    }).catch(function(error) {
      console.log(error)
    }); 
  }
  return <div>
    {/* add travel plan  */}
    <Button 
        className="btn-icon btn-2" 
        color='info' 
        type="button"
        onClick={()=> {
          console.log('clicked + button to add plan')
        }}
      >
          <span className="btn-inner--icon">
            <AddCircleOutlineIcon/>
            {/* <AddIcon/> */}
            
          </span>
      </Button>

      {/* logout button */}
      <Button 
        className="btn-icon btn-2 logout" 
        color='info' 
        type="button"
        onClick={()=> {
          console.log('clicked logout')
          logout()
        }}
      >
          <span className="btn-inner--icon">
            <ExitToAppIcon/>
          </span>
      </Button>
  </div>
}



function Footer() {
  return <div className='footer'>
  </div>
}


function SearchBar(props){

  var searchTerm = ""
  var [text, setText] = useState('')
  var [searchedPlans, setPlans] = useState([])
 
 return <div className='search-bar'>
    <FormGroup>
      <InputGroup className="mb-4">
        <Input 
          placeholder="Search" 
          type="text" 
          value={text} 
          onChange={e=> setText(e.target.value)}
          onKeyPress={async e=> {
            if(e.key ==='Enter') {
              searchTerm = text
              searchedPlans = await queryPlans(searchTerm)
              setPlans(searchedPlans)
              setText('')
            }
          }}
        />

        <InputGroupAddon addonType="append">
          <InputGroupText style={{backgroundColor: "#f5365c"}}
            onClick={async ()=> {
              if(text) 
                searchTerm = text
                searchedPlans = await queryPlans(searchTerm)
                setPlans(searchedPlans)
                setText('')
              }}
          >
            <i className="ni ni-zoom-split-in" style={{color: "white"}}/>
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </FormGroup>

    {searchedPlans && searchedPlans.length && <TripPlans searchedPlans={searchedPlans} />}

  </div>
}

async function GetPhoto(tag) {
   const key = "fdb273ec503fcd089ceece3adbb2e0e0"
   let url = "https://api.flickr.com/services/rest/?method=flickr.photos.search"
   let id=  "187059476"
   url += '&api_key='+ key
   url += "&user_id"+ id
   url += "%40N02"
   url += "&tags=" + tag
   url += "&text=" + tag
   url += "&content_type=1"
   url += "&media=photos"
   url += "&per_page=1"
   url += "&page=1"
   url += "&geo_context=2"
   url += "&format=json&nojsoncallback=1"
   const info = await fetch(url)
   const plan = await info.json()
   let imgID = plan["photos"]["photo"][0]["id"]
   let imgFarmID = plan["photos"]["photo"][0]["farm"]
   let imgServerID = plan["photos"]["photo"][0]["server"]
   let imgSecret = plan["photos"]["photo"][0]["secret"]
   let imgUrl = "https://farm" 
   imgUrl += imgFarmID
   imgUrl += ".staticflickr.com/"
   imgUrl += imgServerID
   imgUrl += "/"
   imgUrl += imgID
   imgUrl += "_"
   imgUrl += imgSecret
   imgUrl += ".jpg"

   // send to the database in the respective entry
   // probably have to pass in the specific travel plan as a parameter (database object?)
   // this method gets queried for each new travel plan to get a photo
   
 }

 function TripPlans({searchedPlans}) {
  return <div className="trips">
    {searchedPlans.map((i, city, photo, startDate, endDate)=> <Plan 
      key={i}
      city={searchedPlans["City"]} 
      photo={searchedPlans["Photo"]}
      startDate={searchedPlans["Start Date"]}
      endDate={searchedPlans["End Date"]}
    />)}
  </div>
 }

 function Plan({city, photo, startDate, endDate}) {
  return <div className='trip-card'>
    <div className='trip-text-box'>
      <img src = "https://www.petmd.com/sites/default/files/Senior-Cat-Care-2070625.jpg" className = "trip-picture"/>
      {console.log("hello")}
      <div className='trip-text'>
        <h1>{city}</h1>
      </div>
    </div>
  </div>
 }


export default App;
