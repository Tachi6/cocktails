import { obtainGlobalValoration, obtainUserValoration } from "../models/bestCockailsDB.js"
import { obtainCocktailById } from "../models/theCocktailDB.js"
import { checkData } from "../modules/checkData.js"
import { markSelectedCocktail } from "../views/cocktailsView.js"
import { fillPreparationView, showHidePreparation } from "../views/presentationView.js"
import { fillValorationField } from "../views/valorationView.js"
import { initValorationToogle } from "./presentationController.js"
import { initValorationListeners } from "./valorationController.js"

// To manage selected controller
let selectedCocktail

export const initCocktailsListeners = (size, cocktails, initialAction) => {
    const cocktailElements = document.querySelectorAll(`.square.${size}`)
    
    cocktailElements.forEach((cocktailElement, index) => {
        cocktailElement.addEventListener('click', async () => {
            // If there need a scroll, or open view, ...
            initialAction && initialAction()
            // When cocktail provide of search by ingredient don't have info, need to request to API
            let cocktail
            if (cocktails[index].strIngredient1) {
                cocktail = cocktails[index]
            }
            else {
                cocktail = await checkData(() => obtainCocktailById(cocktails[index].idDrink))
                // If checkData catch error in API request
                if (!cocktail) return
            }
            await cocktailClickAction(cocktailElement, cocktail)
        })
    })
}

const cocktailClickAction = async (cocktailElement, cocktail) => {
    const globalValoration = await checkData(() => obtainGlobalValoration(cocktail.idDrink))  
    // If checkData catch error in API request
    if (!globalValoration) return

    const userValoration = await checkData(() => obtainUserValoration(cocktail.idDrink))
    // If checkData catch error in API request
    if (!userValoration) return
    // mark selected cocktail and unselect previous selected
    markSelectedCocktail(selectedCocktail, cocktailElement)
    // Update controller variable
    selectedCocktail = cocktailElement
    // Prepare presentation view with info of cocktail
    await fillPreparationView(cocktail, globalValoration)
    // Prepare valoration for rating or fill user valoration
    await fillValorationField(userValoration)
    // Open preparation View
    showHidePreparation(true)
    // Init user valoration listener if the user hasn't valorated the cocktail
    if (userValoration.presentation < 0) {
        initValorationListeners(cocktail.idDrink)
    }
    // Toogle to show/hide valoration section
    initValorationToogle()
}

// Need selected cocktail variable in nav bar to clear selected cocktail
export const unmarkSelectedCocktail = () => {
    markSelectedCocktail(selectedCocktail)
}
