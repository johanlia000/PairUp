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
import * as moment from 'moment';


import * as firebase from "firebase/app"
import "firebase/storage"
import { db, queryPlans } from './db'
import "firebase/analytics"
import "firebase/auth";
import { tr } from 'date-fns/locale';
import { set } from 'date-fns';

var provider = new firebase.auth.GoogleAuthProvider();


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
          setGlobal({
            state: false,
          });
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
      {!showIntro && tripPlan && <MakeTrip  closeTrip={()=> setTripPlan(false)}/>}
      {!showIntro &&<Footer />}
      {showIntro && <WelcomePage />}     
    </div>
  );
}


function MakeTrip(props){
  const [citySearchTerm, setCitySearchTerm] = useState('')
  const [city, setCity] = useState('')

  const [countrySearchTerm, setCountrySearchTerm] = useState('')
  const [country, setCountry] = useState('')

  // this is for setting if the user did not input a city or country
  const [errorCityCountry, seterrorCityCountry] = useState(false)
  console.log("error city country" + errorCityCountry)

  const [activites, addActivity] = useState([])
  const [activity, setActivity] = useState('')

  const [selectedStartDate, setSelectedStartDate] = React.useState(null);

  const [selectedEndDate, setSelectedEndDate] = React.useState(null);

  const [name, setName] = useState('')
  const [nameSearch, setNameSearch] = useState('')

  const [contact, setContact] = useState('')
  const [contactSearch, setContactSearch] = useState('')
  

  const handleDateChangeStart = date => {
    setSelectedStartDate(date);
  }; 
  
  const handleDateChangeEnd = date => {
    setSelectedEndDate(date);
  }; 

  async function firebaseMakeTravelPlan(){
    console.log('inside firebase make travel plan function')
    var url = await GetPhoto(JSON.stringify({city}))
    props.closeTrip()
    let travelPlans = db.collection("travelplans").doc()
    let user = firebase.auth().currentUser
    travelPlans.set({
        City: city.toLowerCase(),
        Search: [city.toLowerCase(), country.toLowerCase(), selectedStartDate, selectedEndDate],
        Country: country.toLowerCase(),
        Name: name.toLowerCase(),
        PreferredContact: contact.toLowerCase(),
        Photo: url,
        StartDate: selectedStartDate,
        EndDate: selectedEndDate,
        UserID: user.uid
    })
    for (let i = 0; i < activites.length; i ++) {
      travelPlans.update({
          PlannedActivities: firebase.firestore.FieldValue.arrayUnion(activites[i].toLowerCase())
      });
      travelPlans.update({
        Search: firebase.firestore.FieldValue.arrayUnion(activites[i].toLowerCase())
      });
    }
    console.log('end of firebase make travel plan')
  }

  async function GetPhoto(tag) {
    let tag2 = tag.split(":")
    let tag3 = tag2[1]
    let tag4 = tag3.substring(1, tag3.length -2)
    let tagFinal = tag4
    if (tag4.split(" ").length > 1) {
      tagFinal = tag4.split(" ")[0] + "+" + tag4.split(" ")[1]
    }
    console.log(tagFinal)
    const key = "2b69d30a533e2e4eb9a09fd0fc84ce32"
    let url = "https://api.flickr.com/services/rest/?method=flickr.photos.search"
    let id=  "187059476@N02"
    url += '&api_key='+ key
    url += "&user_id"+ id
    url += "%40N02"
    url += "&tags=" + tagFinal
    url += "&text=" + tagFinal
    url += "&content_type=1"
    url += "&accuracy=11"
    url += "&media=photos"
    url += "&geo_context=2"
    url += "&format=json&nojsoncallback=1"
    const info = await fetch(url)
    const plan = await info.json()
    const randomPhoto = (Math.round(Math.random() * 99))
    let imgID = plan["photos"]["photo"][randomPhoto]["id"]
    let imgFarmID = plan["photos"]["photo"][randomPhoto]["farm"]
    let imgServerID = plan["photos"]["photo"][randomPhoto]["server"]
    let imgSecret = plan["photos"]["photo"][randomPhoto]["secret"]
    let imgUrl = "https://farm" 
    imgUrl += imgFarmID
    imgUrl += ".staticflickr.com/"
    imgUrl += imgServerID
    imgUrl += "/"
    imgUrl += imgID
    imgUrl += "_"
    imgUrl += imgSecret
    imgUrl += ".jpg"
    console.log(imgUrl)
    return imgUrl
  }

  return <div className='makeTrip'>
    <div className='userTripInputs'>
      <div className='destinationChosen'><b>City: </b> {city}</div>
      <div className='destinationChosen'><b>Country: </b> {country}</div>
      <div className='dateChosen'><b>Start Date: </b>
        {selectedStartDate && moment(selectedStartDate).format('MMMM Do YYYY')}
      </div>
      <div className='dateChosen'><b>End Date: </b>
        {selectedEndDate && moment(selectedEndDate).format('MMMM Do YYYY')}
      </div>
      <div className='activitiesChosen'><b>Activities: </b> 
        {activites.map((item, index)=>
        <span key={index}> 
          <span>{item}</span>
          {index<activites.length-1 && <span>, </span>}
        </span>
        )}
      </div>
      <div className='dateChosen'><b>Name:  </b>{name} </div>
    </div>

    <div className='setDate'>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
              disableToolbar
              variant="inline"
              color="secondary"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-dialog"
              label="Start Date"
              value={selectedStartDate}
              onChange={
                handleDateChangeStart
              }
              
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
        </MuiPickersUtilsProvider>
    </div>
    <div className='setDate'>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          color="secondary"
          id="date-picker-dialog"
          label="End Date"
          value={selectedEndDate}
          onChange={
            handleDateChangeEnd
          }
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        </MuiPickersUtilsProvider>
    </div>


    <div className='searchDestination'>
      <TextField  fullWidth
        label="Enter City" 
        variant="outlined" 
        color="secondary"
        value={citySearchTerm} 
        onChange={e=> setCitySearchTerm(e.target.value)}
            onKeyPress={async e=> {
              if(e.key ==='Enter' && citySearchTerm != 0) {
                console.log("pressed enter " + citySearchTerm)
                setCity(citySearchTerm)
                setCitySearchTerm('')
              }
            }}
      />
      <Button 
        id='search-button'
        variant="outlined" 
        color="secondary"
        onClick={async ()=> {
          if(citySearchTerm != 0) 
            console.log('clicked the button: ' + citySearchTerm)
            setCity(citySearchTerm)
            setCitySearchTerm('')
          }}
      >
        <SearchIcon /> 
      </Button>
    </div>

    <div className='searchDestination'>
      <TextField  fullWidth
        label="Enter Country" 
        variant="outlined" 
        color="secondary"
        value={countrySearchTerm} 
        onChange={e=> setCountrySearchTerm(e.target.value)}
            onKeyPress={async e=> {
              if(e.key ==='Enter' && countrySearchTerm != 0) {
                console.log("pressed enter " + countrySearchTerm)
                setCountry(countrySearchTerm)
                setCountrySearchTerm('')
              }
            }}
      />
      <Button 
        id='search-button'
        variant="outlined" 
        color="secondary"
        onClick={async ()=> {
          if(citySearchTerm != 0) 
            console.log('clicked the button: ' + countrySearchTerm)
            setCountry(countrySearchTerm)
            setCountrySearchTerm('')
          }}
      >
        <SearchIcon /> 
      </Button>
    </div>


    <div className='searchActivities'>
      <TextField  fullWidth
          label="Enter Activities" 
          variant="outlined" 
          color="secondary"
          value={activity} 
            onChange={e=> setActivity(e.target.value)}
            onKeyPress={async e=> {
              if(e.key ==='Enter') {
                console.log('pressed enter' + activity)
                addActivity(activites => [...activites, activity])
                setActivity('')
                console.log(activites)
              }
            }}
        />

        <Button 
          id='search-button'
          variant="outlined" 
          color="secondary"
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

    <div className='searchDestination'>
      <TextField  fullWidth
        label="Enter Name" 
        variant="outlined" 
        color="secondary"
        value={nameSearch} 
        onChange={e=> setNameSearch(e.target.value)}
            onKeyPress={async e=> {
              if(e.key ==='Enter' && nameSearch.length != 0) {
                console.log("pressed enter " + nameSearch)
                setName(nameSearch)
                setNameSearch('')
              }
            }}
      />
      <Button 
        id='search-button'
        variant="outlined" 
        color="secondary"
        onClick={async ()=> {
          if(nameSearch.length > 0) 
            console.log('clicked the button: ' + nameSearch)
            setName(nameSearch)
            setNameSearch('')
          }}
      >
        <SearchIcon /> 
      </Button>
    </div>

    <div className='searchDestination'>
      <TextField  fullWidth
        label="Enter Preferred Contact" 
        variant="outlined" 
        color="secondary"
        value={contactSearch} 
        onChange={e=> setContactSearch(e.target.value)}
            onKeyPress={async e=> {
              if(e.key ==='Enter' && contactSearch.length != 0) {
                console.log("pressed enter " + contactSearch)
                setContact(contactSearch)
                setContactSearch('')
              }
            }}
      />
      <Button 
        id='search-button'
        variant="outlined" 
        color="secondary"
        onClick={async ()=> {
          if(contactSearch.length > 0) 
            console.log('clicked the button: ' + contactSearch)
            setContact(contactSearch)
            setContactSearch('')
          }}
      >
        <SearchIcon /> 
      </Button>
    </div>

    {errorCityCountry && <div className='cityCountryError'>Please enter a city and/or country!</div>}
    <div className='saveButtonTrips'>
      <Button 
          style={{backgroundColor: "#f5365c"}}
          className='saveButtonTrip'
          variant="contained" 
          size="large"
          color="primary"
          onClick={async ()=> {
            console.log('Clicked the save button')
            console.log("City: "+ city)
            console.log(city.length)
            console.log("Country: "+ country)
            console.log(country.length)
            console.log("Activities: "+ activites)
            console.log("Start Date: "+ selectedStartDate) // this is an object
            console.log("End Date: "+ selectedEndDate) // this is an object
            if(city.length > 0){ // this works
              console.log("city > 0")
              seterrorCityCountry(false)
              firebaseMakeTravelPlan()
            } else if (city.length <= 0 && country.length > 0) { // this works
              console.log("country no city")
              firebaseMakeTravelPlan()
              seterrorCityCountry(false)
            } else if (city.length <=0 && country.length <= 0) {
              console.log('no city no country')
              // throw an error because they didnt put either
              seterrorCityCountry(true)
            }
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
        style={{backgroundColor: "#f5365c"}}
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

  const [signupErrorValue, setSignupErrorValue] = useState('')
  console.log(signupErrorValue)

  const [signupError, setSignupError] = useState(false)
  console.log(signupError)

  // Sign up and make user on firebase with email and password
  function signUp(){
    console.log("SIGNUP")
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(result) {
      setGlobal({
        state: false,
      });
      setDialogOpen(false) // close dialog
      setSignupErrorValue('')
      setSignupError(false)
      console.log("in the error-free branch")
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("error: " + error)
      setSignupErrorValue(error.message)
      setSignupError(true)
    })
  }

  // Login with email and password
  function loginEmail(){
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(result) {
      setGlobal({
        state: false,
      });
      setDialogOpen(false) // close dialog
      setSignupErrorValue('')
      setSignupError(false)
      console.log("in the error-free branch")
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("error: " + error)
      setSignupErrorValue(error.message)
      setSignupError(true)
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
      style={{backgroundColor: "#f5365c", marginTop: "1.5rem"}}    
      className="button-container" 
      size="large"
      variant="contained" 
      color="primary"
      onClick={() => setDialogOpen(true)}
    >
      Login
    </Button>
    <Dialog 
      open={dialogOpen}
      onClose={() => {
        console.log("CLOSE 2")
        setDialogOpen(false)
      }}
      aria-labelledby="simple-dialog-title">
      <DialogTitle id="simple-dialog-title">
        <div className='loginPopupLogo'>
          <img className = 'logoPic' src="/Photos/logooutlined.png" alt="PairUp Logo"/>
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
        
        {signupError && <div className='orGoogle'>{signupErrorValue}</div>}
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
                //setDialogOpen(false)
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
      <Typography variant="h5" className='title'>PairUp</Typography>
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
    size="large"
    style={{backgroundColor: "#f5365c", marginRight:".25rem"}}
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
    size="large"
    style={{backgroundColor: "#f5365c", marginLeft:".25rem"}}
    onClick={()=> {
      console.log('clicked logout')
      logout()
    }}
  >
    <ExitToAppIcon/>
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

 
 return <div>
   <div className='search-bar'>
    <TextField  fullWidth
      id="outlined-secondary"
      label="Search"
      variant="outlined"
      color="secondary"
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
      color="secondary"
      variant="outlined"
      id='search-button'
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

  
    </div>
    {!(message) && searchedPlans && searchedPlans.length > 0 && <TripPlans searchedPlans={searchedPlans} />}
    {message && <NoTrips />}
  </div>
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
  console.log(props.plan)

  

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
            {/* Neither start date nor end date */}
            {!props.plan.StartDate && !props.plan.EndDate && <span>No preffered dates</span>} 

            {/* both start date and end date */}
            {props.plan.StartDate && props.plan.EndDate && moment(props.plan.StartDate.seconds * 1000).format('MMMM Do YYYY')} 
            {props.plan.StartDate && props.plan.EndDate && <span> - </span>} 
            {props.plan.StartDate && props.plan.EndDate && moment(props.plan.EndDate.seconds * 1000).format('MMMM Do YYYY')}

            {/* Only have start date */}
            {props.plan.StartDate && !props.plan.EndDate && <span>Start date: </span>} 
            {props.plan.StartDate && !props.plan.EndDate && moment(props.plan.StartDate.seconds * 1000).format('MMMM Do YYYY')}

            {/* Only have end date */}
            {!props.plan.StartDate && props.plan.EndDate && <span>End date: </span>} 
            {!props.plan.StartDate && props.plan.EndDate && moment(props.plan.EndDate.seconds * 1000).format('MMMM Do YYYY')}

          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    
    {showDetails && <Dialog />}

  
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
              {/* Neither start date nor end date */}
              {!props.plan.StartDate && !props.plan.EndDate && <span>No preffered dates</span>} 

              {/* both start date and end date */}
              {props.plan.StartDate && props.plan.EndDate && moment(props.plan.StartDate.seconds * 1000).format('MMMM Do YYYY')} 
              {props.plan.StartDate && props.plan.EndDate && <span> - </span>} 
              {props.plan.StartDate && props.plan.EndDate && moment(props.plan.EndDate.seconds * 1000).format('MMMM Do YYYY')}

              {/* Only have start date */}
              {props.plan.StartDate && !props.plan.EndDate && <span>Start date: </span>} 
              {props.plan.StartDate && !props.plan.EndDate && moment(props.plan.StartDate.seconds * 1000).format('MMMM Do YYYY')}

              {/* Only have end date */}
              {!props.plan.StartDate && props.plan.EndDate && <span>End date: </span>} 
              {!props.plan.StartDate && props.plan.EndDate && moment(props.plan.EndDate.seconds * 1000).format('MMMM Do YYYY')}
            </Typography>
            <Typography variant="body2">
              <span className="key">Trip Owner: </span><span>{props.plan.Name}</span>
              <div><span className="key">Preferred Contact: </span><span className="lowercase">{props.plan.PreferredContact}</span></div>
              <div><span className="key">Planned Activities: </span><span>{Activities(props.plan.PlannedActivities)}</span></div>
            </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} variant="outlined" color="secondary">
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
      <Typography className="brand" variant="h2" component="h2" gutterBottom>Welcome to PairUp!</Typography>
      <LoginButton />
    </div>
  </div>
}

export default App;
