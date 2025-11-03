const ingredientsElement = document.querySelector('.ingredients-list')
export const verticalButtons = document.querySelectorAll('.arrow-button.vertical')

export const resetVerticalArrowsPosition = () => ingredientsElement.style.top = '0px'

// Reset arrows to don't show and use
export const removeVerticalArrows = () => {
    verticalButtons[0].classList.remove('arrow-up')
    verticalButtons[1].classList.remove('arrow-down')
}

// Show 1 arrow if there ara more than a page
export const showVerticalArrows = (totalPages) => {
    if (totalPages > 0) {
        verticalButtons[0].classList.remove('arrow-up')
        verticalButtons[1].classList.add('arrow-down')
    }
}

// Move scroll position depending of to desired top Position
export const moveIngredientsPosition = (topPosition) => ingredientsElement.style.top = `${topPosition}px`

// For toogle arrow when is the start or the end of list
export const showHideVerticalArrowButtons = (up, down) => {
    verticalButtons[0].classList.toggle('arrow-up', up)
    verticalButtons[1].classList.toggle('arrow-down', down)
}
