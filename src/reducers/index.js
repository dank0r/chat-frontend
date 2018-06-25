import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import users from './users';
import posts from './posts';
import dialogs from './dialogs';


const reducers = combineReducers({
  users,
  posts,
  dialogs,
  form: formReducer,
});

export default reducers;