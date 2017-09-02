const users = (state={}, action={}) => {
  let response = action.response || null;
  let error = action.error || null;
  switch(action.type) {
    case 'LOG_IN_REQUEST':
      return { ...state, isLoading: true };
    case 'LOG_IN_SUCCESS':
      return { ...state, list: state.list.concat(response), userID: response.id, isLoading: false, error: null };
    case 'LOG_IN_FAILURE':
      return {...state, userID: null, isLoading: false, error}; //!!!

    case 'FETCH_USERS_REQUEST':
      return { ...state, isLoading: true };
    case 'FETCH_USERS_SUCCESS':
      return { ...state, list: state.list.concat(response), isLoading: false, error: null };
    case 'FETCH_USERS_FAILURE':
      return {...state, isLoading: false, error};

    default:
      return state;
  }
};

export default users;