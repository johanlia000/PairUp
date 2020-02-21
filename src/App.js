import React, {useState} from "react"
import "./App.css"
import { Button } from "reactstrap"
// reactstrap components
import {
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup
} from "reactstrap"
import * as firebase from "firebase/app"
import "firebase/storage"
import { db, queryPlans } from './db'
import "firebase/analytics"


function App() {
  return (
    <div className="App">
      <Header />
      <Footer />
      <SearchBar />
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

// function Message({m, name}){
//   return <div className="message-wrap"
//     from={m.name===name?'me':'you'}
//     onClick={()=>console.log(m)}>
//     <div className="message">
//       <div className="msg-name">{m.name}</div>
//       <div className="msg-text">
//         {m.text}
//         {m.img && <img src={bucket + m.img + suffix} alt="pic" />}
//       </div>
//     </div>
//   </div>
// }

export default App;
