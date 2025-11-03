import { uploadAverage, uploadRating } from "../models/bestCockailsDB.js"
import { checkData } from "../modules/checkData.js"
import { showPopUpMessage } from "../views/popUpView.js"
import { changeValorationLabel, redrawStars } from "../views/valorationView.js"

// Variable for user valoration
const rating = {
    presentation: 0,
    creativity: 0,
    valoration: 0,
}

export const initValorationListeners = (cocktailId) => {
    // Obtain all star rating elements
    const ratingStars = document.querySelectorAll('.valoration-container .rating-star')
    // Reset rating variables
    rating.presentation = 0
    rating.creativity = 0
    rating.valoration = 0
    // Create controllers for deny a revaloration in category
    const controllers = {
        presentation: new AbortController(),
        creativity: new AbortController(),
        valoration: new AbortController(),
    }
    // Listeners for click on rating stars
    ratingStars.forEach((star, index) => star.addEventListener('click', async () => {
        // Obtain category of rating
        const category = star.parentElement.classList[0]
        // Obtain all rating stars
        let stars = obtainCategoryStars(ratingStars, category)
        // Obtain real index of star in category
        let realIndex = obtainStarsIndex(index, category)
        // Remove listener for category stars to prevent revaloration
        controllers[category].abort()
        // Update variable
        rating[category] = realIndex + 1
        // Paint stars 
        redrawStars(stars, realIndex)
        // If all categories are valorated, send valoration to DB
        if (rating.presentation !== 0 && rating.creativity !== 0 && rating.valoration !== 0) {
            // First calculate global valoration and upload to Firebase 
            const isAverageUpdated = await checkData(() => uploadAverage(cocktailId, rating))
            // If checkData catch error in API request
            if (!isAverageUpdated) return
            // Last upload user valoration (rating)
            const isUploaded = await checkData(() => uploadRating(cocktailId, rating))
            // If checkData catch error in API request
            if (!isUploaded) return
            // Show pop-up confirmation
            showPopUpMessage('.send-confirmation')
            // Change valortion label text
            changeValorationLabel()
        }
       
    },{
        // Assign controller by category
        signal: controllers[star.parentElement.classList[0]].signal
    }))
    // Listeners for hover on rating stars
    ratingStars.forEach((star, index) => star.addEventListener('mouseover', () => {
        // Obtain category of rating
        const category = star.parentElement.classList[0]
        // Obtain all rating stars
        let stars = obtainCategoryStars(ratingStars, category)
        // Obtain real index of star in category
        let realIndex = obtainStarsIndex(index, category)
        // Paint stars        
        redrawStars(stars, realIndex, true)
    },{
        // Assign controller by category
        signal: controllers[star.parentElement.classList[0]].signal
    }))

    ratingStars.forEach(star => star.addEventListener('mouseout', () => {
        // Obtain category of rating
        const category = star.parentElement.classList[0]
        // Obtain all rating stars
        let stars = obtainCategoryStars(ratingStars, category)
        // Paint stars 
        redrawStars(stars)
    },{
        // Assign controller by category
        signal: controllers[star.parentElement.classList[0]].signal
    }))
}

// Returns rating stars depending of category
const obtainCategoryStars = (ratingStars, category) => {
    let stars = [...ratingStars] 
    // There are 3 grups of 5 stars
    if (category === 'presentation') {
        return stars.slice(0, 5)
    }
    else if (category === 'creativity') {
        return stars.slice(5, 10)
    }
    else {
        return stars.slice(10, 15)
    }
}

// Obtain rating stars real index in category
const obtainStarsIndex = (index, category) => {
    // Adjust max index of each category
    if (category === 'presentation') {
        return index
    }
    else if (category === 'creativity') {
        return index - 5
    }
    else {
        return index - 10
    }
}
