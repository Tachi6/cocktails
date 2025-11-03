import { delayAwait } from "../modules/delay.js"
import { loadTemplate } from "../modules/template.js"
import { createCocktailElements } from "./cocktailsView.js"
import { resetVerticalArrowsPosition } from "./verticalArrowsView.js"

export const ingredientsMatches = document.querySelector('.ingredients-matches')
const ingredientsView = document.querySelector('.ingredients-view')
const ingredientsHelpText = document.querySelector('.ingredients-text.help-text')
const selectedIngredients = document.querySelector('.selected-ingredients')
const cocktailsIngredientsLabel = document.querySelector('.cocktails-ingredients h2')

// Create letter elements
const createLetters = async (letters) => {
    const letterTemplate = await loadTemplate('#letter-template')
    
    const fragment = document.createDocumentFragment();
    
    letters.forEach(letter => {
        const clone = letterTemplate.cloneNode(true)
        clone.querySelector('button').textContent = letter
        fragment.appendChild(clone)
    })
    
    return fragment
}

// Add letter elements to DOM
export const addLetters = async (letters) => {
    const lettersTemplate = await createLetters(letters)
    
    document.querySelector('.letters').appendChild(lettersTemplate)

    return document.querySelectorAll('.letter')
}

export const markSelectedLetter = (oldSelectedletter, newSelectedLetter) => {
    // To prevent error when there aren't letter selected
    if (oldSelectedletter !== undefined) {
        oldSelectedletter.classList.remove('selected')
    }
    newSelectedLetter.classList.add('selected')
}

// Create ingredient elements
const createIngredients = async (ingredients) => {
    const ingredientTemplate = await loadTemplate('#ingredient-template')

    const fragment = document.createDocumentFragment();

    ingredients.forEach(ingredient => {
        const clone = ingredientTemplate.cloneNode(true)
        clone.querySelector('button').textContent = ingredient.strIngredient1
        fragment.appendChild(clone)
    })

    return fragment
}

// Add ingredient elements to DOM and manage transitions and arrows display
export const addIngredients = async (ingredients) => {
    const ingredientsList = document.querySelector('.ingredients-list')
    const ingredientsHintLabel = document.querySelector('.hint-label')
    const ingredientsHintText = document.querySelector('.ingredients-text.hint-text')

    ingredientsList.classList.add('hide')
    ingredientsHintLabel.classList.toggle('hide', true)
    ingredientsHintText.classList.toggle('hide', true)
    // To await end transition
    await delayAwait(500)

    resetVerticalArrowsPosition()

    if (ingredients.length === 0) {
        // No need to display more, only in first start
        ingredientsHintLabel.classList.add('no-display')

        ingredientsList.replaceChildren()
        // Change hint text to display no results text on first init
        if (!ingredientsHintLabel.classList.contains('no-display')) {
            ingredientsHintText.textContent = 'No se encontraron ingredientes con la inicial seleccionada'
        }
        ingredientsHintText.classList.remove('hide')
    }    
    else {
        const ingredientsTemplate = await createIngredients(ingredients)
        ingredientsList.replaceChildren(ingredientsTemplate)

        ingredientsList.classList.remove('hide')
    }    
}    

// Add selected ingredient, construct cocktails results and manage transitions
export const addSelectedIngredientAndMatches = async (ingredient, cocktails) => {   
    selectedIngredients.classList.add('hide')
    ingredientsHelpText.classList.add('hide')
    ingredientsMatches.classList.add('hide')
    // To await end transition
    await delayAwait(500)
    // If there are no ingredient is a deleted element, no need to add new selected element
    const selectedIngredientTemplate = ingredient && await createSelectedIngredient(ingredient)
    // Always check if there are results or need no results text
    const ingredientsMatchesTemplate = await createIngredientsMatches(cocktails)
    // If there are ingredient, append to selected ingredients
    selectedIngredientTemplate && selectedIngredients.appendChild(selectedIngredientTemplate)
    // If there are results, append to cocktails results view
    ingredientsMatchesTemplate && ingredientsMatches.appendChild(ingredientsMatchesTemplate)
    
    selectedIngredients.classList.remove('hide')
    ingredientsMatches.classList.remove('hide')
    cocktailsIngredientsLabel.classList.remove('hide')
}

// Remove selected ingredient from DOM
export const removeSelectedIngredient = (ingredient) => ingredient.remove()

// Create selected ingredient element 
const createSelectedIngredient = async (ingredient) => {
    const selectedIngredientTemplate = await loadTemplate('#selected-ingredient-template')
    
    const clone = selectedIngredientTemplate.cloneNode(true)
    const ingredientName = ingredient.textContent
    clone.querySelector('p').textContent = `${ingredientName}`
    
    const ingredientNameUrl = ingredientName.toLowerCase().replaceAll(' ', '%20')
    clone.querySelector('img').src = `https://www.thecocktaildb.com/images/ingredients/${ingredientNameUrl}-small.png` 
    
    return clone
}

// Remove cocktails results. Then show no results text or create cocktails squares
const createIngredientsMatches = async (cocktails) => {
    ingredientsMatches.replaceChildren()
    
    if (cocktails.length === 0) {
        ingredientsHelpText.classList.remove('hide')
    }
    else {
        return await createCocktailElements(cocktails, 'regular')
    }
}

// Configure cocktails results view for one single page, no need scroll, and is centered
export const configureSinglePage = () => {
    ingredientsMatches.style.justifyContent = 'center'
    ingredientsMatches.style.marginLeft = '0px'
}

// Configure cocktails results view for one multi page, need scrolls, spacers and margin to correct view
export const configureMultiPages = (width, needMargin ) => {
    const spacers = document.querySelectorAll('.spacer')
    
    ingredientsMatches.style.justifyContent = 'start'
    spacers[0].style.width = `${width}px`
    spacers[1].style.width = `${width}px`
    if (needMargin) {
        ingredientsMatches.style.marginLeft = `${width}px`
    }
}

// Expand and contract selected ingredients view and manage transitions
export const expandContractIngredientsView = async (expand) => {
    if (!expand) {
        ingredientsHelpText.classList.add('hide')
        cocktailsIngredientsLabel.classList.add('hide')
        ingredientsMatches.classList.add('hide')
        // To await end transition
        await delayAwait(500)
    }
    ingredientsView.classList.toggle('expanded', expand)
    if (expand) {
        // To await end transition
        await delayAwait(500)
    }
}

export const showHideIngredientsView = (show) => {
    // For set correct left position, if there are selected ingredients, then is opened
    const selectedIngredientsLength = document.querySelectorAll('.selected-ingredient').length
    // Asign open and use open left position
    if (selectedIngredientsLength > 0) {
        ingredientsView.classList.add('open')
    }
    // Use closed left position
    else {
        ingredientsView.classList.remove('open')
    }
    ingredientsView.classList.toggle('show', show)
}
