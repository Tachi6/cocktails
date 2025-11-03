export const horitzontalButtons = document.querySelectorAll('.arrow-button.horitzontal')
const ingredientsMatches = document.querySelector('.ingredients-matches')

// Reset arrows to don't show and use
export const removeHoritzontalArrows = () => {
    horitzontalButtons[0].classList.remove('arrow-left')
    horitzontalButtons[1].classList.remove('arrow-right')
}

// Reset scroll position to init and show 1 arrow if there ara more than a page
export const showHoritzontalArrows = (totalPages) => {
    ingredientsMatches.style.left = 'var(--screen-padding)'
    
    if (totalPages > 0) {
        horitzontalButtons[0].classList.remove('arrow-left')
        horitzontalButtons[1].classList.add('arrow-right')
    }
}

// Move scroll position depending of square size
export const moveCocktailsPosition = (step) => {
    // Obtain exact size with decimals
    const squareWidth = ingredientsMatches.getBoundingClientRect().height
    ingredientsMatches.style.left = `calc(var(--screen-padding) - (((${squareWidth}px + 1vw) * ${step}))`
}

// For toogle arrow when is the start or the end of list
export const showHideHoritzontalArrowButtons = (left, right) => {
    horitzontalButtons[0].classList.toggle('arrow-left', left)
    horitzontalButtons[1].classList.toggle('arrow-right', right)
}
