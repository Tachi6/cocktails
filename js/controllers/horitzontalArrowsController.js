import { horitzontalButtons, moveCocktailsPosition, showHideHoritzontalArrowButtons } 
    from "../views/horitzontalArrowsView.js"

// Variables depending of number of results on cocktails by ingredients  
let actualPage = 0
let totalPages = 0
let cocktailsPerPage = 0

// Horitzontal buttons listeners
export const initHoritzontalArrowsListeners = () => 
    horitzontalButtons.forEach(horitzontalButton => 
        horitzontalButton.addEventListener('click', () => scrollCocktailsWithButton(horitzontalButton))
    )

// Update variables depending of number of results on cocktails by ingredients  
export const updateCocktailsPerPage = (totalCocktails, cocktailsInside) => {
    actualPage = 0
    cocktailsPerPage = cocktailsInside
    // Pages is in base 0, not 1, substract 1 a real total pages
    totalPages = Math.ceil(totalCocktails / cocktailsInside) - 1
    
    return totalPages
}

// Change page depending of button
export const scrollCocktailsWithButton = (horitzontalButton) => {
    if (horitzontalButton.classList.contains('arrow-left')) {
        changePage(-1)
    }
    if (horitzontalButton.classList.contains('arrow-right')) {
        changePage(1)
    }
    // Move left position to simulate page change
    moveCocktailsPosition(cocktailsPerPage * actualPage)
    // Check if need or not arrows depending actual page
    needHoritzontalArrowButtons()
}

// Obtain new page and check if is first or last page
const changePage = (movePage) => {
    if (movePage === 1 && actualPage === totalPages) return
    
    if (movePage === -1 && actualPage === 0) return
        
    actualPage += movePage
}

// Check if need or not arrows depending actual page
const needHoritzontalArrowButtons = () => {
    if (actualPage === 0) {
        showHideHoritzontalArrowButtons(false, true)
    }
    else if (actualPage === totalPages) {
        showHideHoritzontalArrowButtons(true, false)                  
    }
    else {
        showHideHoritzontalArrowButtons(true, true)
    }
}
