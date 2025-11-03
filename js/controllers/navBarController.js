import { initCocktailsListeners, unmarkSelectedCocktail } from "./cocktailsController.js"
import { obtainBestCocktails } from "../models/bestCockailsDB.js"
import { obtainCocktails } from "../models/theCocktailDB.js"
import { checkData } from "../modules/checkData.js"
import { delayAwait } from "../modules/delay.js"
import { moveWindowToPosition, obtainScreenWidth } from "../modules/window.js"
import { appendCocktailElements, createCocktailElements } from "../views/cocktailsView.js"
import { showHideIngredientsView } from "../views/ingredientsView.js"
import { unmarkNavBarButtons, markNavBarButton, navBarButtons } from "../views/navBarView.js"
import { showHidePreparation } from "../views/presentationView.js"
import { checkIfSideBarOpen, showHideSideBar } from "../views/sideBarView.js"
import { resetScrollPosition } from "./sideBarController.js"

// NavBar buttons listener
export const initNavBarListeners = () => {
    navBarButtons.forEach(button => button.addEventListener('click', (e) => {
        // To mark selected button
        markNavBarButton(button)
        navBarClickAction(e.target.id)
    }))
}

const navBarClickAction = async (selection) => {
    if (selection === 'home') {
        // Move scroll to top
        moveWindowToPosition(0)
        // Close all views
        showHidePreparation(false)
        showHideSideBar(false)
        showHideIngredientsView(false)
        // Unmark selected cocktail
        unmarkSelectedCocktail()
    }
    else if (selection === 'ingredients') {
        // Check if sideBar is open
        const isSideBarOpen = checkIfSideBarOpen()
        // Close not needed views
        showHideSideBar(false)
        // To await end transition if SideBar is open
        if (isSideBarOpen) {
            await delayAwait(500)
        }
        // Unmark selected cocktail
        unmarkSelectedCocktail()
        // Close not needed view after transition
        showHidePreparation(false)
        // Open need view
        showHideIngredientsView(true)
    } 
    else {
        // Select cocktails to show in sideBar by selection id
        const cocktails = await checkData(selection === 'best'
            ? obtainBestCocktails
            : () => obtainCocktails(selection)
        )
        // If checkData catch error in API request
        if (!cocktails) return
        // Close not need view
        showHideIngredientsView(false)
        // If screen is small, not show two views in main screen
        if (obtainScreenWidth() < 1280) {
            showHidePreparation(false)           
        }
        // Create cocktail elements
        const cocktailsFragment = await createCocktailElements(cocktails, 'small')
        // Appends cocktails elements to cocktail list of sidebar
        await appendCocktailElements(cocktailsFragment, '.scroll-list')
        // Reset scroll list position, for view at start
        resetScrollPosition()
        // Init cocktail click listener for all new cocktails elements
        initCocktailsListeners('small', cocktails, () => {
            // If screen is small, close sidebar
            if (obtainScreenWidth() < 1280) {
                showHideSideBar(false)
                // Unmark all NavBar buttons
                unmarkNavBarButtons()
                // Unmark selected cocktail
                unmarkSelectedCocktail()
            }
        })
        // Open need view
        showHideSideBar(true)
    } 
}
