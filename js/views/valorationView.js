import { delayAwait } from "../modules/delay.js"
import { loadTemplate } from "../modules/template.js"

export const openCloseValorationToogle = (valorationButton) => {
    const valoration = document.querySelector('.valoration-container')
    valoration.classList.toggle('show')
    // Change icon if is open
    valorationButton.classList.toggle('hide-icon')
}

export const fillValorationField = async (userValoration) => {   
    const presentationCategory = document.querySelector('#presentation')   
    const creativityCategory = document.querySelector('#creativity')
    const valorationCategory = document.querySelector('#valoration')
    // Change label name
    if (userValoration.presentation > 0) {
        document.querySelector('h3.valoration-text').textContent = 'VER VALORACIÓN'
    }
    const starRatingTemplate = await loadTemplate('#rating-star-template')
    const ratingCategories = [presentationCategory, creativityCategory, valorationCategory]
    // All all rating stars and fill only necessary
    ratingCategories.forEach(category => {
        const categoryName = category.id
        for (let i = 1; i <= 5; i++) {
            const clone = starRatingTemplate.cloneNode(true)

            clone.querySelector('div').classList.add(categoryName)

            if (userValoration[categoryName] > 0 && i <= userValoration[categoryName]) {
                // Fill stars when is under or equal valoration whue user has valorated cocktail
                clone.querySelector('div').classList.add('fill')
            }
            category.querySelector('.rating').appendChild(clone)
        }
    })
}

// Used for paint stars, when rating, is rated and hovered
export const redrawStars = (stars, selectedIndex, hover) => {
    // Receive a category group of stars
    stars.forEach((star, index) => {
        // Remove fill for all stars
        star.parentElement.classList.remove('fill')
        // Remove hover color for all stars
        star.classList.remove('hover')
        // Paint all the stars under the selected or hovered
        if (index <= selectedIndex) {
            star.parentElement.classList.add('fill')
            // If is hovered and need hovered color
            hover && star.classList.add('hover')
        }
    })
}

export const changeValorationLabel = async () => {
    const valorationText = document.querySelector('h3.valoration-text')

    valorationText.classList.add('hide')

    await delayAwait(250)
    
    valorationText.textContent = 'VER VALORACIÓN'
    
    await delayAwait(250)
    
    valorationText.classList.remove('hide')
}
