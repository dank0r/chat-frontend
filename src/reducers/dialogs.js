const dialogs = (state = {}, action = {}) => {
  const response = action.response || null;
  const error = action.error || null;
  switch (action.type) {
    case 'FETCH_DIALOGS_REQUEST':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_DIALOGS_SUCCESS':
      console.log('response: ', response);
      console.log('list: ', state.list.concat(response.filter(dialogRes => !state.list.some(dialog => dialog.id === dialogRes.id))
        .map(dialog => ({
          ...dialog,
          participants: dialog.participants.map(p => p.id),
        }))));
      return {
        ...state,
        list: state.list
          .concat(response
            .filter(dialogRes => !state.list.some(dialog => dialog.id === dialogRes.id))
            .map(dialog => ({
              ...dialog,
              participants: dialog.participants.map(p => p.id),
            }))),
        isLoading: false,
        error: null,
      };
    case 'FETCH_DIALOGS_FAILURE':
      return { ...state, isLoading: false, error };

    case 'FETCH_MESSAGES_REQUEST':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_MESSAGES_SUCCESS':
      return {
        ...state,
        list: state.list.map(d =>
          d.id === response.dialogID ? {
            ...d,
            messages: response.messages.slice().reverse().concat(d.messages),
          }
            : d),
        isLoading: false,
        error: null,
      };
    case 'FETCH_MESSAGES_FAILURE':
      return { ...state, isLoading: false, error };

    case 'CREATE_DIALOG_REQUEST':
      return { ...state, isLoading: true, error: null };
    case 'CREATE_DIALOG_SUCCESS':
      return {
        ...state,
        list: state.list.concat(response),
        newRedirect: response.id,
        isLoading: false,
        error: null,
      };
    case 'CREATE_DIALOG_FAILURE':
      return {
        ...state,
        newRedirect: null,
        isLoading: false,
        error,
      };

    case 'REMOVE_DIALOG_REQUEST':
      return {
        ...state,
        list: state.list.filter(d => d.id !== action.body.dialogID),
        isLoading: true,
        error: null,
      };
    case 'REMOVE_DIALOG_SUCCESS':
      return { ...state, isLoading: false, error: null };
    case 'REMOVE_DIALOG_FAILURE':
      return { ...state, isLoading: false, error };


    case 'TYPING_START':
      return {
        ...state,
        list: state.list.map(d =>
          d.id === action.dialogID ?
            {
              ...d,
              typingUsers: (d.typingUsers || []).some(tu => tu === action.userID) ?
                (d.typingUsers || []) :
                (d.typingUsers || []).concat(action.userID),
            } :
            d),
      };

    case 'TYPING_END':
      return {
        ...state,
        list: state.list.map(d =>
          d.id === action.dialogID ?
            { ...d, typingUsers: (d.typingUsers || []).filter(u => u !== action.userID) } :
            d),
      };

    case 'NEW_MESSAGE':
      return {
        ...state,
        list: state.list.map(d =>
          d.id === action.dialogID ?
            { ...d, messages: d.messages.concat(action.message) } :
            d),
      };

    case 'NEW_VIEW':
      return {
        ...state,
        list: state.list.map(d =>
          d.id === action.dialogID ?
            {
              ...d,
              messages: d.messages.map(m => m.id === action.messageID ? {
                ...m,
                viewedBy: !m.viewedBy.some(vb => vb === action.userID) ?
                  m.viewedBy.concat(action.userID) : m.viewedBy,
              } : m),
            } :
            d),
      };

    case 'NEW_REDIRECT':
      return { ...state, newRedirect: action.id };

    case 'NEW_REDIRECT_NULL':
      return { ...state, newRedirect: null };

    case 'LOG_OUT':
      return {
        ...state,
        list: [],
        isLoading: false,
        error: null,
      };

    default:
      return state;
  }
};

export default dialogs;