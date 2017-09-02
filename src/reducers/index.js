import { combineReducers } from 'redux';
import users from './users';
import posts from './posts';
import dialogs from './dialogs';
import { reducer as formReducer } from 'redux-form';

const reducers = combineReducers({
  users,
  posts,
  dialogs,
  form: formReducer,
});

export default reducers;