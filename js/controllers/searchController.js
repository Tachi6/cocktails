import { obtainCocktails, searchCocktails } from "../models/theCocktailDB.js"
import { checkData } from "../modules/checkData.js"
import { moveWindowToPosition, obtainScreenWidth } from "../modules/window.js"
import { appendCocktailElements, createCocktailElements } from "../views/cocktailsView.js"
import { showHideIngredientsView } from "../views/ingredientsView.js"
import { unmarkNavBarButtons } from "../views/navBarView.js"
import { addSearchedBorderColor, hideEmptyResultsText, searchField, showEmptyResultsText } from "../views/searchView.js"
import { showHideSideBar } from "../views/sideBarView.js"
import { initCocktailsListeners } from "./cocktailsController.js"

// Create squares with the result of search or with the random cocktails
export const createCocktailResults = async (cocktails) => {
    // If no receive cocktails, show random cocktails
    if (cocktails === undefined) {
        cocktails = await checkData(() => obtainCocktails('randomselection'))
        // If checkData catch error in API request
        if (!cocktails) return
    }
    // If results are empty, show empty message
    if (cocktails.length === 0) {
        showEmptyResultsText()
    }  
    // Create cocktails elements
    const cocktailsFragment = await createCocktailElements(cocktails, 'medium')
    // Appends cocktails elements to search results
    await appendCocktailElements(cocktailsFragment, '.results')
    // Init cocktail click listener for all new cocktails elements 
    initCocktailsListeners('medium', cocktails, () => {
        // Move scroll to correct view preparation
        moveWindowToPosition(100)
        // Close ingredients view
        showHideIngredientsView(false)
        // Unmark ingredients and home buttons
        unmarkNavBarButtons('#ingredients')
        unmarkNavBarButtons('#home')
        // If screen is small, close sidebar
        if (obtainScreenWidth() < 1280) {
            showHideSideBar(false)
            // Unmark all NavBar buttons
            unmarkNavBarButtons()
        }
    })
}

// Search listener of input text with return button or input text focus
export const initSearchListener = () => {
    searchField.addEventListener("keypress", async (e) => {
        // Check if enter is pressed
        if (e.key === 'Enter') {
            // Unfocus search text field
            searchField.blur()
            // Change input text border color
            addSearchedBorderColor(true)
            // Hide empty results text if is opened
            hideEmptyResultsText()
            // API request to obtain searched cocktails 
            const cocktails = await checkData(() => searchCocktails(e.target.value))
            // If checkData catch error in API request
            if (!cocktails) return
            // View cocktails elements in results
            await createCocktailResults(cocktails)
        }
    })
    // Chech is input text is focus
    searchField.addEventListener('focus', (e) => {
        // Move scroll to focus on input text
        moveWindowToPosition(e.target.offsetTop + e.target.offsetHeight)
        // Change input text border color
        addSearchedBorderColor(false)
    })
}
