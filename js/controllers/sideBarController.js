import { moveScrollBar, showHideArrowButtons } from "../views/sideBarView.js"

// Variables for simulate scrolling
let scrollPosition = 0
// Cocktails (squares) has 20 units of height plus gap who has 1 unit
const scrollStep = 21
// Max units scroll position
const maxScrollPosition = -147

// Add sideBar listeners for buttons and for mouse wheel
export const initSidebarArrowsListeners = () => {
    const scrollButtons = document.querySelectorAll('.arrow-button')

    scrollButtons.forEach(button => button.addEventListener('click', () => scrollBarWithButton(button)))
    
    const scrollList = document.querySelector('.scroll-list')

    // Wheel scroll inside this container is exclusive for him, not effect to window (with passive: false)
    scrollList.addEventListener('wheel', (e) => scrollBarWithWheel(e),{passive: false})
}

const calculeScrollPosition = (direction) => {
    // If is in start and need exceed start
    if (scrollPosition === 0 && direction === 1) return
    // if is in end and need exceed end
    if (scrollPosition === maxScrollPosition && direction === -1) return
    else {
        scrollPosition += (scrollStep * direction)
    }
}

// Action for button listener
const scrollBarWithButton = (button) => {
    if (button.classList.contains('arrow-up')) {
        calculeScrollPosition(1)        
    }
    if (button.classList.contains('arrow-down')) {
        calculeScrollPosition(-1)
    }
    // Change scroll position to simulate scroll
    moveScrollBar(scrollPosition)
    // If need or not arrow buttons
    showHideArrowButtons(scrollPosition === 0, scrollPosition === maxScrollPosition)
}

const scrollBarWithWheel = (event) => {
    // Deny scroll page with wheel in this container
    event.preventDefault();
    event.stopPropagation();
    
    if (event.deltaY > 0) {
        calculeScrollPosition(-1)
    }
    if(event.deltaY < 0) {
        calculeScrollPosition(1)
    }
    // Change scroll position to simulate scroll
    moveScrollBar(scrollPosition)
    // If need or not arrow buttons
    showHideArrowButtons(scrollPosition === 0, scrollPosition === maxScrollPosition)
}

// Reset scroll position and default arrows
export const resetScrollPosition = () => {
    scrollPosition = 0
    moveScrollBar(scrollPosition)
    showHideArrowButtons(scrollPosition === 0, scrollPosition === maxScrollPosition)
}
