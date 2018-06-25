const request = (requestOptions, actionName, endpoint) => ({
  CALL_API: {
    types: [`${actionName}_REQUEST`, `${actionName}_SUCCESS`, `${actionName}_FAILURE`],
    endpoint,
    requestOptions,
  },
});

export const authorization = session => dispatch =>
  dispatch(request({
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session,
    }),
  }, 'LOG_IN', 'authorization'));

export const logIn = (username, password) => dispatch =>
  dispatch(request({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
    }),
  }, 'LOG_IN', 'login'));

export const signUp = (username, firstname, lastname, password) => dispatch =>
  dispatch(request({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      firstname,
      lastname,
      password,
    }),
  }, 'SIGN_UP', 'signup'));

export const fetchDialogs = (user, offset, limit) => dispatch =>
  dispatch(request({
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userID: user.id,
      password: user.password,
      limit,
      offset,
    }),
  }, 'FETCH_DIALOGS', 'dialogs'));

export const fetchMessages = (user, dialogID, offset, limit) => dispatch =>
  dispatch(request({
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userID: user.id,
      password: user.password,
      dialogID,
      limit,
      offset,
    }),
  }, 'FETCH_MESSAGES', 'messages'));

export const fetchSocial = id => dispatch =>
  dispatch(request({
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
    }),
  }, 'FETCH_SOCIAL', 'subscribes'));

export const fetchUser = id => dispatch =>
  dispatch(request({
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
    }),
  }, 'FETCH_USERS', 'users'));

export const fetchRandomUsers = (amount, besides) => dispatch =>
  dispatch(request({
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount,
      besides,
    }),
  }, 'FETCH_USERS', 'users/random'));

export const createDialog = (user, participants, name) => dispatch =>
  dispatch(request({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      participants,
      userID: user.id,
      password: user.password,
    }),
  }, 'CREATE_DIALOG', 'dialogs'));

export const removeDialog = (user, dialogID) => dispatch =>
  dispatch(request({
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dialogID,
      userID: user.id,
      password: user.password,
    }),
  }, 'REMOVE_DIALOG', 'dialogs'));

export const fetchPostsOf = (author, limit, offset) => dispatch =>
  dispatch(request({
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      author,
      limit,
      offset,
    }),
  }, 'FETCH_POSTS', 'posts'));

export const addPost = (userID, session, text) => dispatch =>
  dispatch(request({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userID,
      session,
      text,
    }),
  }, 'ADD_POST', 'posts'));

export const subscribe = (id, userID, session) => dispatch =>
  dispatch(request({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      userID,
      session,
    }),
  }, 'SUBSCRIBE', 'subscribes'));

export const unsubscribe = (id, userID, session) => dispatch =>
  dispatch(request({
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      userID,
      session,
    }),
  }, 'UNSUBSCRIBE', 'subscribes'));

export const changeStatus = (status, userID, session) => dispatch =>
  dispatch(request({
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status,
      userID,
      session,
    }),
  }, 'CHANGE_STATUS', 'status'));

export const changePersonal = (data, userID, session) => dispatch =>
  dispatch(request({
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data,
      userID,
      session,
    }),
  }, 'CHANGE_PERSONAL', 'changepersonal'));


export const typingStart = data => ({
  type: 'TYPING_START',
  userID: data.userID,
  dialogID: data.dialogID,
});

export const typingEnd = data => ({
  type: 'TYPING_END',
  userID: data.userID,
  dialogID: data.dialogID,
});

export const newMessage = data => ({
  type: 'NEW_MESSAGE',
  dialogID: data.dialogID,
  message: data.message,
});

export const newView = data => ({
  type: 'NEW_VIEW',
  userID: data.userID,
  dialogID: data.dialogID,
  messageID: data.messageID,
});

export const newRedirect = id => ({
  type: 'NEW_REDIRECT',
  id,
});

export const logOut = () => ({
  type: 'LOG_OUT',
});