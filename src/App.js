import React, {useState, useEffect} from 'reactn';
import {setGlobal, useGlobal} from 'reactn';
import './App.css';
import "./App.css";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import Dialog from '@material-ui/core/Dialog';
import EmailIcon from '@material-ui/icons/Email';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import InputAdornment from '@material-ui/core/InputAdornment';
import MomentUtils from '@date-io/moment';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Grid from '@material-ui/core/Grid';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import 'date-fns';

// reactstrap components
// import {
//   FormGroup,
//   Button,
//   Input,
//   InputGroupAddon,
//   InputGroupText,
//   InputGroup,
//   Card,
//   CardHeader,
//   CardBody,
//   Form,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter
// } from "reactstrap";
import * as firebase from "firebase/app"
import "firebase/storage"
import { db, queryPlans } from './db'
import "firebase/analytics"
import "firebase/auth";
import { tr } from 'date-fns/locale';
import { set } from 'date-fns';
const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});
const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);
setGlobal({
  state: true
})


function App() {
  const [user, setUser] = useState(null)
  const [showIntro, setShowIntro] = useGlobal("state")
  const [tripPlan, setTripPlan] = useState(false)

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
      {!showIntro && <Header user={user} tripPlan={tripPlan} setTripPlan={setTripPlan}/>}
      {!showIntro && !tripPlan && <SearchBar />}
      {!showIntro && tripPlan && <MakeTrip closeTrip={()=> setTripPlan(false)}/>}
      {!showIntro &&<Footer />}
      {showIntro && <WelcomePage />}     
    </div>
  );
}



function MakeTrip(props){
  const [destinationSearchTerm, setDestinationSearchTerm] = useState('')
  const [destination, setDestination] = useState('')

  const [activites, addActivity] = useState([])
  const [activity, setActivity] = useState('')

  const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));
  const handleDateChange = date => {
    console.log("first" + date)
    setSelectedDate(date);
    console.log(selectedDate)
  };  

  return <div className='makeTrip'>
    <div className='userTripInputs'>
      <div className='destinationChosen'><b>Destination: </b> {destinationSearchTerm}</div>
      <div className='dateChosen'><b>Date: </b>  </div>
      <div className='activitiesChosen'><b>Activities: </b> 
        {activites.map((item, index)=>
        <span key={index}> 
          <span>{item}</span>
          {index<activites.length-1 && <span>, </span>}
        </span>
        )}
      </div>
    </div>

    <div className='setDate'>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-dialog"
            label="Start Date"
            value={selectedDate}
            onChange={
              handleDateChange
            }
            
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
      </MuiPickersUtilsProvider>
        
    </div>


    <div className='searchDestination'>
      <TextField  fullWidth
        label="Enter Destination" 
        variant="outlined" 
        value={destination} 
        onChange={e=> setDestination(e.target.value)}
            onKeyPress={async e=> {
              if(e.key ==='Enter' && destination != 0) {
                console.log("pressed enter " + destination)
                setDestination('')
                setDestinationSearchTerm(destination)
              }
            }}
      />

      <Button 
        id='search-button'
        variant="contained" 
        color="primary"
        onClick={async ()=> {
          if(destination != 0) 
            console.log('clicked the button: ' + destination)
            setDestination('')
            setDestinationSearchTerm(destination)
          }}
      >
        <SearchIcon /> 
      </Button>
    </div>

    <div className='searchActivities'>
      <TextField  fullWidth
          label="Enter Activities" 
          variant="outlined" 
          value={activity} 
            onChange={e=> setActivity(e.target.value)}
            onKeyPress={async e=> {
              if(e.key ==='Enter' && activity != 0) {
                console.log('pressed enter' + activity)
                addActivity(activites => [...activites, activity])
                setActivity('')
                console.log(activites)
              }
            }}
        />

        <Button 
          id='search-button'
          variant="contained" 
          color="primary"
          onClick={async ()=> {
            if(activity != 0) 
              console.log('clicked the button: ' + activity)
              addActivity(activites => [...activites, activity])
              setActivity('')
              console.log(activites)
            }}
        >
          <SearchIcon /> 
        </Button>
    </div>

    <div className='saveButtonTrips'>
      <Button 
          style={{backgroundColor: "#f5365c", fontSize:'1.3rem'}}
          className='saveButtonTrip'
          variant="contained" 
          size="large"
          color="primary"
          onClick={async ()=> {
            console.log('clicked the save button')
            console.log(destination)
            console.log(activites)
            console.log(selectedDate)
            props.closeTrip()
          }}
        >
          Save 
        </Button>
    </div>
   
  </div>
}

function MakeTripHeader(props){
  return <div>
      <Button 
        variant="contained"
        color="primary"
        onClick={()=> {
          console.log('clicked + button to add plan')
          props.closeTrip()
        }}
      >
        <CancelIcon/>
    </Button>
  
  </div>
}

function LoginButton(props){
  const [dialogOpen, setDialogOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  var provider = new firebase.auth.GoogleAuthProvider();

  const [signupErrorValue, setSignupErrorValue] = useState('')
  console.log(signupErrorValue)
  const [signupError, setSignupError] = useState(false)
  console.log(signupError)

  // Sign up and make user on firebase with email and password
  function signUp(){
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      console.log(error)
      setGlobal({
        state: false,
      });
      if(error){ // if there is an error
        setSignupErrorValue(error.message)
        setSignupError(true)
      } else { // if there is no error
        setDialogOpen(false) // close dialog
        setSignupErrorValue('')
        setSignupError(false)
      }

      // if (error){
      //   // console.log(typeof(error.message)) // string
      //   // console.log(error.message) // correct error message
      //   console.log('yes there is an error.')
      //   setSignupErrorValue(error.message)
      //   setSignupError(true)
      //   //console.log('setting error message for signup')
      // }

    });    
  }

  // Login with email and password
  function loginEmail(){
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      setGlobal({
        state: false,
      });
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error)
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
      setGlobal({
        state: false,
      });
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
      variant="contained" 
      color="primary"
      onClick={() => setDialogOpen(true)}
    >
      Login
    </Button>
    <Dialog 
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      aria-labelledby="simple-dialog-title">
      <DialogTitle id="simple-dialog-title">
        <div className='loginPopupLogo'>
          <img className = 'logoPic' src="/Photos/logo.png" alt="PairUp Logo"/>
        </div>
        <div className='email-login'>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
              <EmailIcon />
            </Grid>
            <Grid item>
              <TextField 
                id="input-with-icon-grid" 
                label="Email" 
                placeholder="Email" 
                type="email" 
                value={email} 
                onChange={e=> setEmail(e.target.value)}
              />
            </Grid>
          </Grid>        
        </div>
        
        <div className='password-login'>
           <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
              <LockOpenIcon />
            </Grid>
            <Grid item>
              <TextField 
                id="input-with-icon-grid" 
                label="Password" 
                placeholder="Password" 
                type="password" 
                value={password}
                onChange={e=> setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
        </div>
        
        {signupError && <div>{signupErrorValue}</div>}
        <div className='loginSignupButton'>
          <Button 
            variant="contained" 
            color="primary"
            onClick={async ()=> {
              if(email && password) 
                console.log(email)
                console.log(password)
                setEmail('')
                setPassword('')
                console.log("calling signup")
                signUp()
                // if (signupError){ // if there is an error
                //   setDialogOpen(true)
                // } else{ // if there is not an error
                //   setSignupError(false)
                //   setDialogOpen(false)
                // }
            }}
          >
            Sign Up
          </Button>

          <Button 
            variant="contained" 
            color="primary"
            onClick={async ()=> {
              if(email && password) 
                console.log(email)
                console.log(password)
                setEmail('')
                setPassword('')
                setDialogOpen(false)
                loginEmail() 
            }}
          >
            Login
          </Button>
        </div>

        <div className='orGoogle'>or login with</div>

        <div className='googleButton'>
          <Button 
            variant="contained" 
            color="primary"
            style={{backgroundColor: "#DB4437", outlineColor:"#DB4437"}}
            onClick={async ()=> {
              if(email && password) 
                console.log(email)
                console.log(password)
                setEmail('')
                setPassword('')
                setDialogOpen(false)
                googleLogin() 
            }}
          >
            Google
          </Button>
        </div>
        



      </DialogTitle>
    </Dialog>

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
      {props.user && !props.tripPlan && <TaskBar openTrip={()=> props.setTripPlan(true)}/>}
      {props.user && props.tripPlan && <MakeTripHeader closeTrip={()=> props.setTripPlan(false)}/>}
    </div>
  </div>
}


function TaskBar(props){
  function logout(){
    firebase.auth().signOut().then(function() {
      console.log('successful logout!')
      setGlobal({
        state: true,
      });
    }).catch(function(error) {
      console.log(error)
    }); 
  }
  return <div>

  <Button 
    variant="contained"
    color="primary"
    onClick={()=> {
      console.log('clicked + button to add plan')
      props.openTrip()
    }}
  >
      <AddCircleOutlineIcon/>
  </Button>

  <Button 
    className='logout'
    variant="contained"
    color="primary"
    onClick={()=> {
      console.log('clicked logout')
      logout()
    }}
  >
    <ExitToAppIcon/>
  </Button>
    
    {/* <Button 
        className="btn-icon btn-2" 
        color='info' 
        type="button"
        onClick={()=> {
          console.log('clicked + button to add plan')
          props.openTrip()
        }}
      >
          <span className="btn-inner--icon">
            <AddCircleOutlineIcon/>
          </span>
      </Button>

   
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
      </Button> */}
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

 
 return <div>
   <div className='search-bar'>
    <TextField  fullWidth
      label="Search" 
      variant="outlined" 
      value={text} 
      onChange={e=> setText(e.target.value)}
      onKeyPress={async e=> {
        if(e.key ==='Enter') {
          console.log("pressed enter: "+ text)
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

    <Button 
      id='search-button'
      variant="contained" 
      color="primary"
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
      <SearchIcon /> 
    </Button>

    {/* <FormGroup>
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
    </FormGroup> */}
    </div>
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

  const useStyles = makeStyles({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 140,
    },
  });
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [showDetails, setShowDetails] = useState(false)
  const classes = useStyles();

  return <div>
    <Card 
      className={classes.root}
      id="card"
      onClick={() => {
        setShowDetails(true)
        setOpen(true)
        console.log("clicked")
      }}>
      <CardActionArea>
        <CardMedia
            className={classes.media}
            component="img"
            height="40"
            image= {props.plan.Photo}
            title= "trip photo"
          />
        <CardContent className="title-case">
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

    {/* <Dialog>
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
      </Card> */}
    {/* </Dialog> */}

    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} className="trip-details">
        <CardMedia
            className={classes.media}
            image={props.plan.Photo}
            title= "photo of location"
          />
        <DialogContent dividers className="title-case">
            <Typography gutterBottom variant="h5" component="h2">
              {props.plan.City}, {props.plan.Country}
            </Typography>
            <Typography gutterBottom variant="subtitle2">
              {Date(props.plan.startDate)} - {Date(props.plan.endDate)}
            </Typography>
            <Typography variant="body2">
              <span className="key">Trip Owner: </span><span>{props.plan.Name}</span>
              <div><span className="key">Preferred Contact: </span><span className="lowercase">{props.plan.PreferredContact}</span></div>
              <div><span className="key">Planned Activities: </span><span>{Activities(props.plan.PlannedActivities)}</span></div>
            </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
  </div>
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
  const useStyles = makeStyles({
    root: {
      width: '100%',
      maxWidth: 500,
    },
  });
  const classes = useStyles();
  return <div>
    <img src= "/Photos/village.jpg" className ="welcome-img" />
    <div className="welcome">
      <div className="logo-container">
        <img src="/Photos/logo.png" className= "welcome-logo" />
      </div>
      <Typography className="brand" variant="h1" component="h2" gutterBottom>Welcome to PairUp!</Typography>
      <LoginButton className="button-container"/>
    </div>
  </div>
}

export default App;
