const posts = (state = {}, action = {}) => {
  const response = action.response || null;
  const error = action.error || null;
  switch (action.type) {
    case 'FETCH_POSTS_REQUEST':
      return { ...state, isLoading: true };
    case 'FETCH_POSTS_SUCCESS':
      return {
        ...state,
        list: state.list.concat(response),
        isLoading: false,
        error: null,
      };
    case 'FETCH_POSTS_FAILURE':
      return { ...state, isLoading: false, error };

    case 'ADD_POST_REQUEST':
      return { ...state, isLoading: true };
    case 'ADD_POST_SUCCESS':
      return {
        ...state,
        list: [response].concat(state.list),
        isLoading: false,
        error: null,
      };
    case 'ADD_POST_FAILURE':
      return { ...state, isLoading: false, error };

    case 'LOG_OUT':
      return { list: [], isLoading: false, error: null };

    default:
      return state;
  }
};

export default posts;