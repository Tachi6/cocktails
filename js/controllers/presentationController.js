import { openCloseValorationToogle } from "../views/valorationView.js"

// To show/hide valoration section in preparation view
export const initValorationToogle = () => {
    const valorationButton = document.querySelector('.show-rating-btn')

    valorationButton.addEventListener('click', () => openCloseValorationToogle(valorationButton))
}
