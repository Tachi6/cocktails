const baseUrl = 'https://www.thecocktaildb.com/api/json/v2/'
const apiKey = '961249867'

// Static http request in session. Load every session
let popularCocktails = []
let latestCocktails = []
let randomCocktails = []
let cocktailIngredients = []

// Obtain cocktails by type
export const obtainCocktails = async (selection) => {
    // If There are cocktails loaded no need to http request
    if (selection === 'popular' && popularCocktails.length !== 0) return popularCocktails
    if (selection === 'latest' && latestCocktails.length !== 0) return latestCocktails
    if (selection === 'randomselection' && randomCocktails.length !== 0) return randomCocktails

    const resp = await fetch(baseUrl + apiKey + `/${selection}.php`)
    // Throw error if something went wrong
    if (!resp.ok) {
        throw new Error(resp.status);
    }
    const data = await resp.json()
    // Asign cocktails to desired variable
    if (selection === 'popular') {
        // Sometimes API returns 20 ¿?¿?, only need 10
        popularCocktails = data.drinks.slice(0, 10)
        return popularCocktails
    }
    if (selection === 'latest') {
        // Sometimes API returns 20 ¿?¿?, only need 10
        latestCocktails = data.drinks.slice(0, 10)
        return latestCocktails
    }
    if (selection === 'randomselection') {
        // Only need 8 for 2 rows of search results (if there are nothing searched)
        randomCocktails = data.drinks.slice(0, 8)
        return randomCocktails
    }
}

export const searchCocktails = async (text) => {
    let customEndpoint = '/search.php?s='
    // If search an empty string returns basic view of random cocktails
    if (text.trim().length < 1) return randomCocktails
    // If search only 1 letter, change endpoint for returns all cocktails beginning by this letter
    if (text.trim().length === 1) {
        customEndpoint = '/search.php?f='
    }
    
    const resp = await fetch(baseUrl + apiKey + `${customEndpoint}` + `${text}`)
    // Throw error if something went wrong
    if (!resp.ok) {
        throw new Error(resp.status);
    }
    const data = await resp.json()
    // When there are no results returns null, but we need a empty array
    if (data.drinks === null) return []

    return data.drinks
}

// Load 1 cocktail by ID
export const obtainCocktailById = async (cocktailId) => {
    const resp = await fetch(baseUrl + apiKey + `/lookup.php?i=${cocktailId}`)
    // Throw error if something went wrong
    if (!resp.ok) {
        throw new Error(resp.status);
    }
    const data = await resp.json()
    
    return data.drinks[0]
}

// For manage best cocktails (only store cocktailID, and need all data)
export const obtainCocktailsList = async (cocktailIdList) => 
    await Promise.all(cocktailIdList.map(async (cocktailId) => 
        await obtainCocktailById(cocktailId)
    )
)

// Obtain ingredients list
export const obtainIngredients = async () => {
    const resp = await fetch(baseUrl + apiKey + '/list.php?i=list')
    // Throw error if something went wrong
    if (!resp.ok) {
        throw new Error(resp.status);
    }
    const data = await resp.json()

    cocktailIngredients = data.drinks
    // Sort ingredients
    cocktailIngredients.sort((a, b) => {
        if (a.strIngredient1 > b.strIngredient1) {
            return 1
        }
        if (a.strIngredient1 < b.strIngredient1) {
            return -1
        }
        return 0
    })
}

// Obtain ingredients paginated by first letter
export const filterIngredientsByLetter = (letter) => 
    cocktailIngredients.filter(ingredient => ingredient.strIngredient1[0].toUpperCase() === letter)


export const obtainCocktailsByMultiIngredient = async (ingredients) => {
    const finalUrl = ingredients.map(ingredient => ingredient.replaceAll(' ', '_')).join(',')
    
    const resp = await fetch(baseUrl + apiKey + `/filter.php?i=${finalUrl}`)
    // Throw error if something went wrong
    if (!resp.ok) {
        throw new Error(resp.status);
    }
    const data = await resp.json()
    // Manage 0 results returning empty array
    return data.drinks === 'None Found' ? [] : data.drinks
}
