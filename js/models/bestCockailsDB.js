import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js"
import { obtainCocktailsList } from "./theCocktailDB.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCwL3dcHGnyNsAJmgmQxoo5X1gKeYp6hZY",
    authDomain: "cocktails-web-baec2.firebaseapp.com",
    databaseURL: "https://cocktails-web-baec2-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cocktails-web-baec2",
    storageBucket: "cocktails-web-baec2.firebasestorage.app",
    messagingSenderId: "548534637698",
    appId: "1:548534637698:web:b9d31c91cb6ff55f37109b"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// Open Database
const database = getDatabase(app)
// Select Database
const bestCocktailsDB = ref(database, '/cocktails')
// Variable to store Database in every change
let bestCocktailsData = {}

// Updates best cocktails DB on every change
onValue(bestCocktailsDB, async (snapshot) => {
    bestCocktailsData = snapshot.val()
}, (error) => {
    bestCocktailsData = error  
})

export const obtainBestCocktails = async () => {
    // Throw error if something went wrong
    if (bestCocktailsData instanceof Error) {
        throw new Error(bestCocktailsData);
    }
    // Transform bestCocktails map in array
    const bestCocktailsList = Object.entries(bestCocktailsData)
    // Sort bestCocktails by global valoration
    bestCocktailsList.sort((a, b) => b[1].average.rating - a[1].average.rating)
    // Only need cocktail ID and 10 to show and request cocktain info
    const cocktailIdList = bestCocktailsList.map(cocktail => cocktail[0]).slice(0, 10)
    // Obtain cocktail info for this 10 ID
    return await obtainCocktailsList(cocktailIdList)
}

export const obtainGlobalValoration = async (cocktailId) => {
    // Throw error if something went wrong
    if (bestCocktailsData instanceof Error) {
        throw new Error(bestCocktailsData);
    }
    // If has global valoration, return global valoration
    else if (bestCocktailsData[cocktailId] !== undefined) {
        return bestCocktailsData[cocktailId].average.rating
    }
    // If hasn't global valoration
    else {
        return -1
    }
}

export const obtainUserValoration = async (cocktailId) => {
    // Load uuid of user from localStorage
    const uuid = localStorage.getItem('uuid')
    // Throw error if something went wrong 
    if (bestCocktailsData instanceof Error) {
        throw new Error(bestCocktailsData);
    }
    // If cocktail exists in best cocktails and user has valorated, return uservaloration
    else if (bestCocktailsData[cocktailId] !== undefined && Object.keys(bestCocktailsData[cocktailId]).includes(uuid)) {
        return bestCocktailsData[cocktailId][uuid]
    }
    // If cocktail don't exists in best cocktails
    else {
        return {
            presentation: -1,
            creativity: -1,
            valoration : -1,
        }
    }
}

export const uploadRating = async (cocktailId, rating) => {
    // Load uuid of user from localStorage
    let uuid = localStorage.getItem('uuid')
    // If user not valorated any cocktail, don't have uuid, create and save in localStorage
    if (uuid === null) {
        // Create a unique uuid for the user if not exists
        uuid = crypto.randomUUID()
        localStorage.setItem('uuid', uuid);       
    }
    // Upload rating
    await set(ref(database, `cocktails/${cocktailId}/${uuid}`), {
        presentation: rating.presentation,
        creativity: rating.creativity,
        valoration : rating.valoration,
    })
    // If all is ok, return true, else firebase throw error
    return true
}

export const uploadAverage = async (cocktailId, rating) => {
    // Create a variable with uservaloration, and if there are, the other valorations from DB 
    let averageList = [rating]
    
    if (bestCocktailsData[cocktailId]) {
        averageList = [...averageList, ...Object.values(bestCocktailsData[cocktailId])]
    }

    let lengthCorrection = 0
    // Sum all averages of rating
    const averageSum = averageList.reduce((accumulator, currentValue) => {
        // Check if is rating the value and sum average of rating
        if (currentValue.presentation) {
            return accumulator + calculateAverage(currentValue)
        }
        // If is not rating, not sum and subtract from the length of averageList
        lengthCorrection = 1
        return accumulator
    }, 0)
    // Upload average
    await set(ref(database, `cocktails/${cocktailId}/average`), {
        rating: +(averageSum / (averageList.length - lengthCorrection)).toFixed(2),
    })
    // If all is ok, return true, else firebase throw error
    return true
}

const calculateAverage = (rating) => {
    const totalRate = Object.values(rating).reduce((accumulator, currentValue) => accumulator + currentValue)
    
    return totalRate / 3
}
