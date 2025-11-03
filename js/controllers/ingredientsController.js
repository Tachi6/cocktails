import { filterIngredientsByLetter, obtainCocktailsByMultiIngredient, obtainIngredients }
    from '../models/theCocktailDB.js';
import { addIngredients, addSelectedIngredientAndMatches, markSelectedLetter, removeSelectedIngredient, expandContractIngredientsView, addLetters, ingredientsMatches, configureSinglePage, configureMultiPages, showHideIngredientsView } 
    from '../views/ingredientsView.js';
import { removeVerticalArrows, showVerticalArrows } from '../views/verticalArrowsView.js';
import { checkData } from '../modules/checkData.js';
import { initCocktailsListeners } from './cocktailsController.js';
import { showPopUpMessage } from '../views/popUpView.js';
import { updateTotalPages } from './verticalArrowsController.js';
import { horitzontalButtons, removeHoritzontalArrows, showHoritzontalArrows } from '../views/horitzontalArrowsView.js';
import { updateCocktailsPerPage } from './horitzontalArrowsController.js';
import { obtainScreenWidth } from '../modules/window.js';
import { unmarkNavBarButtons } from '../views/navBarView.js';

// Variables to manage selected Letter and selected ingredients
let selectedLetter
const selectedIngredients = []

// Add lleters listeners
const initLettersListeners = (letters) => {    
    letters.forEach(letter => 
        letter.addEventListener('click', async () => {
            // Mark selected letter and unmark old selected letter
            markSelectedLetter(selectedLetter, letter)
            // Update selected letter variable
            selectedLetter = letter
            // Clear arrows from buttons
            removeVerticalArrows()
            // Obtain ingredients from API
            const ingredients = filterIngredientsByLetter(letter.textContent)
            // Create and add ingredients elements to DOM
            await addIngredients(ingredients)
            // Update total pages of ingredients filtered
            const totalPages = updateTotalPages(ingredients.length)
            // Show needed arrow buttons
            showVerticalArrows(totalPages)
            // Add listeners to ingredients
            initIngredientsListeners()        
        })
    )    
}

const initIngredientsListeners = () => {
    // Obtain ingredients elements from DOM
    const ingredients = document.querySelectorAll('.ingredient')

    ingredients.forEach(ingredient => ingredient.addEventListener('click', async () => {
        // Obtain ingredient name by button
        const ingredientName = ingredient.textContent.trim()      
        // Check ingredient duplicated
        if (selectedIngredients.includes(ingredientName)) {
            showPopUpMessage('.ingredient-alert', 'Ingrediente duplicado')
            return            
        }
        // Check more than 5 ingredientes 
        if (selectedIngredients.length === 5) {
            showPopUpMessage('.ingredient-alert', 'Demasiados ingredientes')
            return
        }
        // Add new selected ingredient
        selectedIngredients.push(ingredientName)
        // Clear arrows from buttons
        removeHoritzontalArrows()
        // Obtain cocktail by multi ingredients from API
        const cocktails = await checkData(() => obtainCocktailsByMultiIngredient(selectedIngredients))
        // If checkData catch error in API request
        if (!cocktails) {
            // remove inserted ingredient if there are any error
            selectedIngredients.pop()
            return
        }
        // Expands ingredients view if needed
        await expandContractIngredientsView(true)
        // Create and add selected ingredient and cocktails results (or non results text) 
        await addSelectedIngredientAndMatches(ingredient, cocktails)
        // Detect how many cocktails fit in results cocktails space, and configure container and spacers
        const cocktailsInside = configureIngredientsMatches(cocktails)
        // Update total pages and reset variables for horitzontal arrows controller
        const totalPages = updateCocktailsPerPage(cocktails.length, cocktailsInside)
        // Show horitzontal arrows if needed
        showHoritzontalArrows(totalPages)
        // Init selected ingredient listener
        initSelectedIngredientListener()
        // Init cocktails listeners
        initCocktailsListeners('regular', cocktails, () => {
            // Close not needed views
            showHideIngredientsView(false)
            // Unmark all NavBar button
            unmarkNavBarButtons()        
        })
    }))
}

const initSelectedIngredientListener = () => {
    // Obtain latest selected ingredient inserted 
    const ingredient = document.querySelector('.selected-ingredient:last-child')

    ingredient.addEventListener('click', async () => {
        // Obtain ingredient name by button
        const ingredientName = ingredient.textContent.trim()
        // Remove selected ingredient by index from variable
        selectedIngredients.splice(selectedIngredients.indexOf(ingredientName), 1)
        // Clear arrows from buttons
        removeHoritzontalArrows()
        // Remove selected ingredient element
        removeSelectedIngredient(ingredient)
        // Check if need to contract ingredients view
        if (selectedIngredients.length === 0) {
           await expandContractIngredientsView(false)
        }
        else {
            // Obtain cocktail by multi ingredients from API
            const cocktails = await checkData(() => obtainCocktailsByMultiIngredient(selectedIngredients))
            // If checkData catch error in API request
            if (!cocktails) return
            // Only create and add cocktails results (or non results text)
            await addSelectedIngredientAndMatches(undefined, cocktails)
            // Detect how many cocktails fit in results cocktails space, and configure container and spacers
            const cocktailsInside = configureIngredientsMatches(cocktails)
            // Update total pages and reset variables for horitzontal arrows controller
            const totalPages = updateCocktailsPerPage(cocktails.length, cocktailsInside)
            // Show horitzontal arrows if needed
            showHoritzontalArrows(totalPages)
            // Init cocktails listeners with
            initCocktailsListeners('regular', cocktails, () => {
                // Close not needed views
                showHideIngredientsView(false)
                // Unmark all NavBar button
                unmarkNavBarButtons()        
            })
        }
    })
}

// Detect how many cocktails fit in results cocktails space, and configure container and spacers
const configureIngredientsMatches = (cocktails) => {
    const horitzontalButtonsContainer = document.querySelector('.horitzontal-buttons-container')

    const windowWidth = obtainScreenWidth()
    // Obtain exact size with decimals
    const horitzontalButtonWidth = horitzontalButtons[0].getBoundingClientRect().width
    const horitzontalButtonsContainerWidth = horitzontalButtonsContainer.getBoundingClientRect().width
    // Height is fixed, cocktails are squared and in this point there are not elements to obtain width
    const squareWidth = ingredientsMatches.getBoundingClientRect().height
    // Calculate the empty space for the cocktails results
    const emptySpace = horitzontalButtonsContainerWidth - (horitzontalButtonWidth * 2)
    // Fixed gap in css (1vw)
    const gap = windowWidth * 0.01
    // How many squares fit inside empty space
    let squaresInside = Math.floor(emptySpace / squareWidth)
    // Check if squares + gaps fit in empty space, if not subtract 1 square inside
    if (((squaresInside * squareWidth) + (gap * (squaresInside - 1))) > emptySpace) {
        squaresInside--
    }
    // Configure a single page
    if (cocktails.length <= squaresInside) {
        configureSinglePage()
    }
    // Configure multiple pages
    else {
        // Calculate rest space (buttons + cocktails + gaps)
        const finalEmptySpace = emptySpace - (squaresInside * squareWidth) - (gap * (squaresInside - 1))
        // First argument, width of spacers, second if need margin to don't center
        configureMultiPages(finalEmptySpace / 2, squaresInside >= 1)
    }
    return squaresInside
}

export const initIngredientsView = async () => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

    // Load ingredients DB from API
    await checkData(obtainIngredients)
    // Create letters elements and add to DOM
    const lettersElements = await addLetters(letters)
    // Init letters listeners
    initLettersListeners(lettersElements)
}
