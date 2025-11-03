// To await duration in async functions, for manage transitions completed 
export const delayAwait = (duration) => {
    return new Promise(resolve => setTimeout(resolve, duration));
}
