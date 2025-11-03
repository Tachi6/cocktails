// Show pop-up for this class, and show only 2 seconds 
export const showPopUpMessage = (elementClass, text) => {
    const popUpElement = document.querySelector(elementClass)
    // If there are a custom text, show this
    if (text) {
        popUpElement.querySelector('p').textContent = text
    }
    popUpElement.classList.add('show')
    
    setTimeout(() => popUpElement.classList.remove('show'), 2000)
}
