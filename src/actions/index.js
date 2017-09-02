const request = (requestOptions, actionName, endpoint) => ({
  CALL_API: {
    types: [`${actionName}_REQUEST`, `${actionName}_SUCCESS`, `${actionName}_FAILURE`],
    endpoint,
    requestOptions,
  },
});

export const logIn = (username, password) => dispatch => {
  dispatch(request({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
    }),
  }, 'LOG_IN', 'login'));
};

export const signUp = (username, firstname, lastname, password) => dispatch => {
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
};

export const fetchDialogs = (dialogs, user) => dispatch => {
  if (user.dialogs.filter(ud => !dialogs.list.some(d => d.id === ud)).lendth !== 0  )
  dispatch(request({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: user.dialogs.filter(ud => !dialogs.list.some(d => d.id === ud)),
      userID: user.id,
      password: user.password,
    }),
  }, 'FETCH_DIALOGS', 'dialogs'));
};

export const fetchMessages = (user, dialogID, offset, limit) => dispatch => {
  dispatch(request({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userID: user.id,
      password: user.password,
      dialogID,
      limit,
      offset,
    }),
  }, 'FETCH_MESSAGES', 'messages'));
};

export const fetchUsers = (query) => dispatch => {
  dispatch(request({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
    }),
  }, 'FETCH_USERS', 'users'));
};

export const fetchRandomUsers = (amount, besides) => dispatch => {
  dispatch(request({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount,
      besides,
    }),
  }, 'FETCH_USERS', 'users/random'));
};

export const createDialog = (user, participants, name) => dispatch => {
  dispatch(request({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      participants,
      userID: user.id,
      password: user.password,
    }),
  }, 'CREATE_DIALOG', 'dialogs/create'));
};

export const removeDialog = (user, dialogID) => dispatch => {
  dispatch(request({
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dialogID,
      userID: user.id,
      password: user.password,
    }),
  }, 'REMOVE_DIALOG', 'dialogs/remove'));
};











export const typingStart = (data) => ({
  type: 'TYPING_START',
  userID: data.userID,
  dialogID: data.dialogID,
});

export const typingEnd = (data) => ({
  type: 'TYPING_END',
  userID: data.userID,
  dialogID: data.dialogID,
});

export const newMessage = (data) => ({
  type: 'NEW_MESSAGE',
  dialogID: data.dialogID,
  message: data.message,
});

export const newView = (data) => ({
  type: 'NEW_VIEW',
  userID: data.userID,
  dialogID: data.dialogID,
  messageID: data.messageID,
});

export const newRedirectNull = () => ({
  type: 'NEW_REDIRECT_NULL'
});