export const navBarButtons = document.querySelectorAll('.nav-btn')

export const markNavBarButton = (button) => {
    // Remove selected to all buttons
    navBarButtons.forEach(button => button.classList.remove('selected'))
    // Add selected to clicked button
    button.classList.add('selected')
}

// Deselect all NavBar buttons
export const unmarkNavBarButtons = (button) => {
    if (button) {
        document.querySelector(button).classList.remove('selected')
    }
    else {
        navBarButtons.forEach(button => button.classList.remove('selected'))
    }
}

