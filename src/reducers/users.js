const users = (state = {}, action = {}) => {
  const response = action.response || null;
  const error = action.error || null;
  const body = action.body || {};
  switch (action.type) {
    case 'LOG_IN_REQUEST':
      return { ...state, isLoading: true };
    case 'LOG_IN_SUCCESS':
      return {
        ...state,
        list: state.list.concat(response),
        userID: response.id,
        isLoading: false,
        error: null,
      };
    case 'LOG_IN_FAILURE':
      return {
        ...state,
        userID: null,
        isLoading: false,
        error,
      };

    case 'SIGN_UP_REQUEST':
      return { ...state, isLoading: true };
    case 'SIGN_UP_SUCCESS':
      return {
        ...state,
        list: state.list.concat(response),
        userID: response.id,
        isLoading: false,
        error: null,
      };
    case 'SIGN_UP_FAILURE':
      return {
        ...state,
        userID: null,
        isLoading: false,
        error,
      };

    case 'FETCH_USERS_REQUEST':
      return { ...state, isLoading: true };
    case 'FETCH_USERS_SUCCESS':
      return {
        ...state,
        list: state.list
          .concat([].concat(response).filter(ru => !state.list.some(u => u.id === ru.id))),
        isLoading: false,
        error: null,
      };
    case 'FETCH_USERS_FAILURE':
      return { ...state, isLoading: false, error };

    case 'FETCH_SOCIAL_REQUEST':
      return { ...state, isLoading: true };
    case 'FETCH_SOCIAL_SUCCESS':
    {
      const friends = response.filter(sub =>
        sub.sender === body.id && response.some(sub1 => sub.receiver === sub1.sender))
        .map(sub => sub.receiver !== body.id ? sub.receiver : sub.sender) || [];

      const subscribers = response.filter(sub =>
        sub.receiver === body.id &&
        !friends.some(friend => friend === sub.sender))
        .map(sub => sub.sender) || [];

      const subscriptions = response.filter(sub =>
        sub.sender === body.id && !friends.some(friend => friend === sub.receiver))
        .map(sub => sub.receiver) || [];


      return {
        ...state,
        list: state.list
          .concat(response.map(sub => sub.User)
            .reduce((prev, val) => {
              if (!prev.some(u => u.id === val.id)) {
                return prev.concat(val);
              }
              return prev;
            }, [])
            .filter(sub => !state.list.some(u => u.id === sub.id)))
          .map((u) => {
            if (u.id === body.id) {
              return {
                ...u,
                subscriptions: subscriptions.filter((v, i, a) => a.indexOf(v) === i),
                subscribers: subscribers.filter((v, i, a) => a.indexOf(v) === i),
                friends: friends.filter((v, i, a) => a.indexOf(v) === i),
              };
            } else if (friends.some(f => f === u.id)) {
              return {
                ...u,
                friends: u.friends.concat(body.id)
                  .filter((v, i, a) => a.indexOf(v) === i),
              };
            } else if (subscribers.some(sub => sub === u.id)) {
              return {
                ...u,
                subscriptions: u.subscriptions.concat(body.id)
                  .filter((v, i, a) => a.indexOf(v) === i),
              };
            } else if (subscriptions.some(sub => sub === u.id)) {
              return {
                ...u,
                subscribers: u.subscribers.concat(body.id)
                  .filter((v, i, a) => a.indexOf(v) === i),
              };
            }
            return u;
          }),
        isLoading: false,
        error: null,
      };
    }
    case 'FETCH_SOCIAL_FAILURE':
      return { ...state, isLoading: false, error };

    case 'SUBSCRIBE_REQUEST':
      return { ...state, isLoading: true };
    case 'SUBSCRIBE_SUCCESS':
    {
      const sender = state.list.find(u => u.id === response.sender);
      if (sender.subscribers.some(sub => sub === response.receiver)) {
        return {
          ...state,
          list: state.list.map((u) => {
            if (u.id === response.sender) {
              return {
                ...u,
                friends: u.friends.concat(response.receiver),
                subscribers: u.subscribers.filter(sub => sub !== response.receiver),
              };
            } else if (u.id === response.receiver) {
              return {
                ...u,
                friends: u.friends.concat(response.sender),
                subscriptions: u.subscriptions.filter(sub => sub !== response.sender),
              };
            }
            return u;
          }),
        };
      }
      return {
        ...state,
        list: state.list.map((u) => {
          if (u.id === response.sender) {
            return {
              ...u,
              subscriptions: u.subscriptions.concat(response.receiver),
            };
          } else if (u.id === response.receiver) {
            return {
              ...u,
              subscribers: u.subscribers.concat(response.sender),
            };
          }
          return u;
        }),
      };
    }
    case 'SUBSCRIBE_FAILURE':
      return { ...state, isLoading: false, error };

    case 'UNSUBSCRIBE_REQUEST':
      return { ...state, isLoading: true };
    case 'UNSUBSCRIBE_SUCCESS':
    {
      const receiver = state.list.find(u => u.id === response.receiver);
      if (receiver.friends.some(sub => sub === response.sender)) {
        return {
          ...state,
          list: state.list.map((u) => {
            if (u.id === response.receiver) {
              return {
                ...u,
                friends: u.friends.filter(f => f !== response.sender),
                subscriptions: u.subscriptions.concat(response.sender),
              };
            } else if (u.id === response.sender) {
              return {
                ...u,
                friends: u.friends.filter(f => f !== response.receiver),
                subscribers: u.subscribers.concat(response.receiver),
              };
            }
            return u;
          }),
        };
      }
      return {
        ...state,
        list: state.list.map((u) => {
          if (u.id === response.receiver) {
            return {
              ...u,
              subscribers: u.subscribers.filter(sub => sub !== response.sender),
            };
          } else if (u.id === response.sender) {
            return {
              ...u,
              subscriptions: u.subscriptions.filter(sub => sub !== response.receiver),
            };
          }
          return u;
        }),
      };
    }
    case 'UNSUBSCRIBE_FAILURE':
      return { ...state, isLoading: false, error };


    case 'CHANGE_STATUS_REQUEST':
      return {
        ...state,
        list: state.list.map(u => u.id === body.userID ? {
          ...u,
          status: body.status,
        } : u),
        isLoading: true,
      };
    case 'CHANGE_STATUS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case 'CHANGE_STATUS_FAILURE':
      return { ...state, isLoading: false, error };


    case 'CHANGE_PERSONAL_REQUEST':
      return {
        ...state,
        isLoading: true,
      };
    case 'CHANGE_PERSONAL_SUCCESS':
      return {
        ...state,
        list: state.list.map(u => u.id === body.userID ? Object.assign({}, u, body.data) : u),
        isLoading: false,
      };
    case 'CHANGE_PERSONAL_FAILURE':
      return { ...state, isLoading: false, error };


    case 'FETCH_DIALOGS_SUCCESS':
      return {
        ...state,
        list: state.list.concat(response.map(d => d.participants)
          .filter(u => !state.list.some(u1 => u1.id === u.id)))
          .reduce((prev, val) => prev.concat(val), [])
          .reduce((prev, val) => {
            if (!prev.some(u => u.id === val.id)) {
              return prev.concat(val);
            }
            return prev;
          }, []),
        isLoading: false,
        error: null,
      };

    case 'LOG_OUT':
      return {
        list: [],
        userID: null,
        isLoading: false,
        error: null,
      };

    default:
      return state;
  }
};

export default users;