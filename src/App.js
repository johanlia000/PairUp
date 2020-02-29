import React, {useState, useEffect} from 'reactn';
import {setGlobal, useGlobal} from 'reactn';
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
  Row,
  Col,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import * as firebase from "firebase/app"
import "firebase/storage"
import { db, queryPlans } from './db'
import "firebase/analytics"
import "firebase/auth";

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

setGlobal({
  state: true
})


function App() {
  const [user, setUser] = useState(null)
  const [showIntro, setShowIntro] = useGlobal("state")

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
      {!showIntro && <Header user={user}/>}
      {!showIntro &&<Footer />}
      {!showIntro && <SearchBar />}
      {showIntro && <WelcomePage />}
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
      onClick={() => {
        setModalOpen(true)
      }}
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
                    console.log("email + " + email)
                    console.log("password + " + password)
                    if(email.length > 0 || password.length > 0) 
                      console.log("hello" + email)
                      console.log("yee" + password)
                      setEmail('')
                      setPassword('')
                      setGlobal({
                        state: false,
                      });
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
                    console.log("email + " + email)
                    console.log("password + " + password)
                    if(email.length > 0 || password.length > 0) 
                      console.log("hello" + email)
                      console.log("yee" + password)
                      setEmail('')
                      setPassword('')
                      setModalOpen(false)
                      setGlobal({
                        state: false,
                      });
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
                      setGlobal({
                        state: false,
                      });
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
  var [message, setMessage] = useState(false)

 
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
              if (searchedPlans.length === 0) {
                setMessage(true)
              } else {
                setMessage(false)
              }
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
                if (searchedPlans.length === 0) {
                  setMessage(true)
                } else {
                  setMessage(false)
                }
                setPlans(searchedPlans)
                setText('')
              }}
          >
            <i className="ni ni-zoom-split-in" style={{color: "white"}}/>
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </FormGroup>

    {!(message) && searchedPlans && searchedPlans.length && <TripPlans searchedPlans={searchedPlans} />}
    {message && <NoTrips />}

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

 function TripPlans({searchedPlans, setMessage, message}) {
  
  return <div className="trips">
    {searchedPlans.map((item, index)=> <Plan 
      plan = {item}
      key = {index}
    />)}
  </div>
 }

 function Plan(props) {

  const [showDetails, setShowDetails] = useState(false)

  return <Card 
      className={classes.root}
      onClick={() => 
        setShowDetails(true)
      }>}
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image= {props.plan.Photo}
          title= "trip photo"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.plan.City}, {props.plan.Country}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {Date(props.plan.startDate)} - {Date(props.plan.endDate)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    
    {showDetails && <Dialog />}

    <Dialog>
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={props.plan.Photo}
            title= "photo of location"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {props.plan.City}, {props.plan.Country}
            </Typography>
            <Typography gutterBottom variant="subtitle2">
              {Date(props.plan.startDate)} - {Date(props.plan.endDate)}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              <span className="key">Trip Owner: </span><span>{props.plan.Name}</span>
              <span className="key">Preferred Contact: </span><span className="lowercase">{props.plan.PreferredContact}</span>
              <span className="key">Planned Activities: </span><span>{Activities(props.plan.PlannedActivities)}</span>
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button 
            size="small" 
            color="primary"
            onClick={() => setShowDetails(false)}
            >
            Close
          </Button>
        </CardActions>
      </Card>
    </Dialog>
 }

 function Date(date) {
   let month = date.substring(0,2)
   let day = date.substring(2)
   if (month === "01") {
     month = "January"
   } else if (month === "02") {
     month = "February"
   } else if (month === "03") {
    month = "March"
  } else if (month === "04") {
    month = "April"
  } else if (month === "05") {
    month = "May"
  } else if (month === "06") {
    month = "June"
  } else if (month === "07") {
    month = "July"
  } else if (month === "08") {
    month = "August"
  } else if (month === "09") {
    month = "September"
  } else if (month === "10") {
    month = "October"
  } else if (month === "11") {
    month = "November"
  } else if (month === "12") {
    month = "December"
  }
  return month + " " + day
 }

 function NoTrips() {
   return <div className="no-trips">
     Sorry, there are no trips matching that search criteria!
   </div>
 }

 
function Activities(activityArray) {
  return <span className="activities">
    {activityArray.map((item, index)=>
      <span>
      <span>{item}</span>
        {index<activityArray.length-1 && <span>,</span>}
      &nbsp;
    </span>
    )}
  </span>
}

function WelcomePage() {
  return <div className="everything">
    <img src= "/Photos/village.jpg" className ="welcome-img" />
    <div className="welcome">
      <div className="logo-container">
        <img src="/Photos/logo.png" className= "welcome-logo" />
      </div>
      <div variant="h1" component="h2">Welcome to PairUp!</div>
      <LoginButton className="button-container"/>
    </div>
  </div>
}

export default App;
