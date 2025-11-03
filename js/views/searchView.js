export const searchField = document.querySelector('#search')
const emptyResults = document.querySelector('.empty-results')

export const hideEmptyResultsText = () => emptyResults.classList.remove('show')

export const showEmptyResultsText = () => emptyResults.classList.add('show')

// To paint search text border depending if is unfocus, focus or searched
export const addSearchedBorderColor = (add) => searchField.classList.toggle('searched', add)