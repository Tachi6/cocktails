import { delayAwait } from "../modules/delay.js"
import { loadTemplate } from "../modules/template.js"

// Fill preparation view with cocktails data of API
export const fillPreparationView = async (cocktail, globalValoration) => {
    const preparationContainer = document.querySelector('.preparation-container')

    // To prevent crash of first time, when there are not content in preparation container
    if (preparationContainer.innerHTML !== '') {
        preparationContainer.classList.add('hide')
        // To await end transition
        await delayAwait(500)
    }
    preparationContainer.replaceChildren()

    const template = await loadTemplate('#preparation-template')
    // Cocktail Image
    template.querySelector('img').src = `${cocktail.strDrinkThumb}/large`
    // Cocktail glass
    template.querySelector('.glass').textContent = `${cocktail.strGlass.toUpperCase()}`
    // If is not alcoholic cocktails, hide under 18 icon, else is showed
    if (cocktail.strAlcoholic !== 'Alcoholic') {
        template.querySelector('.age').classList.add('hide')
    }
    // Cocktail name
    template.querySelector('h2').textContent = `${cocktail.strDrink.toUpperCase()}`
    // Manage if cocktail has global valoration
    await showHideGlobalValoration(template, globalValoration)
    // Manage ingredients
    fillIngredients(cocktail, template)
    // Instructions
    template.querySelector('.description').textContent = cocktail.strInstructionsES || 'Mezclar los ingredientes'

    preparationContainer.appendChild(template)

    preparationContainer.classList.remove('hide')
}

const showHideGlobalValoration = async (template, globalValoration) => {
    // If cocktail has global valoration
    if (globalValoration > 0) {
        // Don't show not-rated
        template.querySelector('.not-rated').remove()
        // Load star template
        const starTemplate = await loadTemplate('#star-template')
        // Rating has 5 stars
        for (let i = 1; i <= 5; i++) {
            const clone = starTemplate.cloneNode(true)
            // Fill stars when is under or equal valoration
            if (i <= globalValoration) {
                clone.querySelector('div').classList.add('fill')
            }
            // If valoration round up (more than 0.5) show half star
            else if (i === Math.round(globalValoration)) {
                clone.querySelector('span').textContent = 'star_half'
            }
            template.querySelector('.final-rating').appendChild(clone)
        }
    }
    // If cocktail hasn't global valoration, remove rating
    else {
        template.querySelector('.final-rating').remove()
    }
}

const fillIngredients = (cocktail, template) => {
    // Ingredients in API has max 15 ingredients with 15 properties name
    for (let i = 1; i <= 15; i++) {
        const liElement = document.createElement('li')
        // Obtain ingredient by index
        const ingredient = cocktail[`strIngredient${i}`]
        // Obtain quantity by index
        const quantity = cocktail[`strMeasure${i}`]
        // If there are no ingredient, remove element
        if (ingredient === null) {
            break
        }
        // If quantity is null, only show ingredient and place in grid area
        else if (quantity === null) {
            liElement.textContent = `${ingredient}`
            liElement.style.gridArea = `i${i}`
        }
        // If quantity & ingredient and place in grid area
        else {
            liElement.textContent = `${quantity.trim()} ${ingredient.trim()}`
            liElement.style.gridArea = `i${i}`
        }

        template.querySelector('ul').appendChild(liElement)
    }
}

export const showHidePreparation = (show) => {
    const preparationScreen = document.querySelector('.preparation')
    
    preparationScreen.classList.toggle('show', show)
}
