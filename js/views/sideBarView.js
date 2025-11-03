const cocktailsBar = document.querySelector('.cocktails-list')

// Move container with transition to simulate scrollB
export const moveScrollBar = (scrollPosition) => {
    const scrollList = document.querySelector('.scroll-list')

    scrollList.style.top = `calc((var(--cocktail-list-unit) * ${scrollPosition}) + var(--screen-padding))`
}

export const showHideArrowButtons = (isTopPosition, isMaxPosition) => {
    const scrollButtons = document.querySelectorAll('.arrow-button')

    // If is in top, remove arrow and prevent move more
    if (isTopPosition) {
        scrollButtons[0].classList.remove('arrow-up')
        scrollButtons[1].classList.add('arrow-down')
    }
    // If is in bottom, remove arrow and prevent move more
    else if (isMaxPosition) {
        scrollButtons[1].classList.remove('arrow-down')
    }
    else {
        scrollButtons[0].classList.add('arrow-up')
        scrollButtons[1].classList.add('arrow-down')
    }
}

export const showHideSideBar = (show) => cocktailsBar.classList.toggle('show', show)

// Check if SideBar is open
export const checkIfSideBarOpen = () => cocktailsBar.classList.contains('show')
