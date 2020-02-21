import * as firebase from "firebase/app"
import "firebase/storage"
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyD0RKfqh2SLTkAD9KOB2RMQ8fwQ6jqmKw0",
    authDomain: "pairuptravel.firebaseapp.com",
    databaseURL: "https://pairuptravel.firebaseio.com",
    projectId: "pairuptravel",
    storageBucket: "pairuptravel.appspot.com",
    messagingSenderId: "985027205264",
    appId: "1:985027205264:web:84fe1d2ad020f5c978a015",
    measurementId: "G-L22N8SB53E"
  }  
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore();

async function queryPlans(searchTerm) {
    searchTerm = searchTerm.toLowerCase()
    const query = db.collection("travelplans")
    const r = await query.where("Search", "array-contains", searchTerm).get()
    const plans=[]
    for (var plan of r.docs) {
        plans.push({...plan.data(), id:plan.id})
    }
    return plans
}

export { db, queryPlans }

