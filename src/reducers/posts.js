const posts = (state={}, action={}) => {
  let response = action.response || null;
  let error = action.error || null;
  switch(action.type) {
    case 'FETCH_POSTS_REQUEST':
      return { ...state, isLoading: true };
    case 'FETCH_POSTS_SUCCESS':
      return { ...state, list: state.list.concat(response), userID: response.id, isLoading: false, error: null };
    case 'FETCH_POSTS_FAILURE':
      return {...state, userID: null, isLoading: false, error};

    default:
      return state;
  }
};

export default posts;