import { showPopUpMessage } from "../views/popUpView.js"

// Check data errors on http request, and show pop-up if needed
export const checkData = async (dataFunction) => {
    try {
        return await dataFunction()
    } 
    catch (error) {
        showPopUpMessage('.data-error', `${error.message}`)
    }
}
