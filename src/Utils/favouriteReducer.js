const favourites = localStorage.getItem('favourite') &&
    JSON.parse(localStorage.getItem('favourite')) || [];
export const favouriteReducer = (state = favourites, action) => {
  switch (action.type) {
    case 'addFav':
        if (!action.city || state.includes(action.city)) {
            return state;
        }
        let addedState = [...state,action.city];
        localStorage.setItem('favourite',JSON.stringify(addedState));
        return addedState;
    case 'removeFav':
        let filtered = state.filter(x => x !== action.city);
        localStorage.setItem('favourite',JSON.stringify(filtered));
        return filtered;
    default:
        return state;
  }
}