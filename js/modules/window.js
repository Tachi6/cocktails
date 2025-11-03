// Move top scroll position to a position with a smooth transition
export const moveWindowToPosition = (position) => {
    window.scrollTo({top: position, behavior: 'smooth'})
}

// Obtain sceen width
export const obtainScreenWidth = () => window.innerWidth