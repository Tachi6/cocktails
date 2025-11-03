import { initHoritzontalArrowsListeners } from './js/controllers/horitzontalArrowsController.js';
import { initIngredientsView } from './js/controllers/ingredientsController.js';
import { initNavBarListeners } from './js/controllers/navBarController.js';
import { createCocktailResults, initSearchListener } from './js/controllers/searchController.js';
import { initSidebarArrowsListeners } from './js/controllers/sideBarController.js';
import { initVerticalArrowsListeners } from './js/controllers/verticalArrowsController.js';

// Init all initial listeners, fill cocktails results with random cocktails and init ingredient view
const start = async () => {
    initNavBarListeners()
    initSidebarArrowsListeners()
    initSearchListener()
    await createCocktailResults()
    await initIngredientsView()
    initVerticalArrowsListeners()
    initHoritzontalArrowsListeners()
}

start()
