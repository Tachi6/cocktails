import { moveIngredientsPosition, showHideVerticalArrowButtons, verticalButtons } from "../views/verticalArrowsView.js"

// Variable to simulate scroll
let actualPage = 0
let totalPages = 0
const elementHeight = document.querySelector('.ingredients-container').getBoundingClientRect().height
const ingredientsPerPage = 10
// 12 is ingredients gap in pixels inside flexbox
const elementGap = 12
// Page step is all container height plus gap of last element
const pageStep = elementHeight + elementGap

// Init listeners with button click or mouse wheel
export const initVerticalArrowsListeners = () => {
    verticalButtons.forEach(verticalButton => 
        verticalButton.addEventListener('click', () => scrollIngredientsWithButton(verticalButton))
    )
    const ingredientsList = document.querySelector('.ingredients-list')
    
    // Wheel scroll inside this container is exclusive for him, not effect to window (with passive: false)
    ingredientsList.addEventListener('wheel', (e) => scrollIngredientsWithWheel(e),{passive: false})
}

// Action for button listener
const scrollIngredientsWithButton = (verticalButton) => {
    // If there are only 1 page not need scroll
    if (totalPages === 0) {
        return                  
    }   
    if (verticalButton.classList.contains('arrow-up')) {
        changePage(-1)
    }
    if (verticalButton.classList.contains('arrow-down')) {
        changePage(1)
    }
    // Change scroll position to simulate scroll
    moveIngredientsPosition(actualPage * pageStep * -1)
    // If need or not arrow buttons
    needVerticalArrowButtons()
}

const scrollIngredientsWithWheel = (event) => {
    // Deny scroll page with wheel in this container
    event.preventDefault();
    event.stopPropagation();
    // If there are only 1 page not need scroll
    if (totalPages === 0) {
        return                  
    }   
    if(event.deltaY < 0) {
        changePage(-1)
    }  
    if (event.deltaY > 0) {
        changePage(1)
    }
    // Change scroll position to simulate scroll
    moveIngredientsPosition(actualPage * pageStep * -1)
    // If need or not arrow buttons
    needVerticalArrowButtons()
}

// Obtain new page and check if is first or last page
const changePage = (movePage) => {
    if (movePage === 1 && actualPage === totalPages) return
    
    if (movePage === -1 && actualPage === 0) return
        
    actualPage += movePage
}

// Check if need or not arrows depending actual page
const needVerticalArrowButtons = () => {
    if (actualPage === 0) {
        showHideVerticalArrowButtons(false, true)                  
    }
    else if (actualPage === totalPages) {
        showHideVerticalArrowButtons(true, false)
    }
    else {
        showHideVerticalArrowButtons(true, true)
    }
}

// Update variables depending of number of results on cocktails by ingredients  
export const updateTotalPages = (ingredientsNumber) => {
    actualPage = 0
    // Pages is in base 0, not 1, substract 1 a real total pages
    totalPages = Math.ceil(ingredientsNumber / ingredientsPerPage) - 1

    return totalPages
}
