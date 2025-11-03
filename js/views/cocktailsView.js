import { delayAwait } from "../modules/delay.js"
import { loadTemplate } from "../modules/template.js"

// Create cocktail elements in diferents sizes 
export const createCocktailElements = async (cocktails, size) => {
    const template = await loadTemplate('#square-template')

    const fragment = document.createDocumentFragment();

    cocktails.forEach((cocktail) => {
        const clone = template.cloneNode(true)
        
        clone.querySelector('.square').classList.add(size)
        clone.querySelector('img').src = `${cocktail.strDrinkThumb}/${size === 'regular' ? 'medium' : size}`
        clone.querySelector('h5').textContent = `${cocktail.strDrink.toUpperCase()}`

        fragment.appendChild(clone)
    })

    return fragment
}

// Add cocktail element to DOM and manage transition
export const appendCocktailElements = async (cocktailsFragment, elementClass) => {
    const element = document.querySelector(elementClass)

    element.classList.add('hide')
    // To await end transition
    await delayAwait(500)
    
    element.replaceChildren()
    element.appendChild(cocktailsFragment)
    element.classList.remove('hide')
}

export const markSelectedCocktail = (oldSelectedCocktail, newSelectedCocktail) => {
    // To prevent error when there aren't cocktail selected
    if (oldSelectedCocktail) {
        oldSelectedCocktail.classList.remove('selected')
    }
    // If there are new cocktail selected, if not only remove old selected cocktail
    if (newSelectedCocktail){
        newSelectedCocktail.classList.add('selected')
    }
}
