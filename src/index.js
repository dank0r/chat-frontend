import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createStore, applyMiddleware } from 'redux';
import io from 'socket.io-client';
import { composeWithDevTools } from 'redux-devtools-extension';
import './index.css';
import App from './components/App';
import api from './middleware/api';
import reducers from './reducers';
import { newMessage, newView, typingStart, typingEnd } from './actions';

injectTapEventPlugin();

const middleware = [thunkMiddleware, api];

const store = createStore(
  reducers, {
    users: {
      list: [
        /* {
          username: 'someusername1',
          firstname: 'First',
          lastname: 'Last',
          id: 2,
          friends: [],
          subscribers: [],
          subscriptions: [],
          posts: [1, 44, 85],
        },
        {
          username: 'someusername2',
          firstname: 'John',
          lastname: 'Smith',
          id: 3,
          friends: [],
          subscribers: [],
          subscriptions: [],
          posts: [1, 44, 85],
        }, */
      ],
      isLoading: false,
      error: null,
      userID: null,
    },
    posts: {
      list: [],
      isLoading: false,
      error: null,
    },
    dialogs: {
      list: [
        /* {
          id: 1,
          participants: [1, 2],
          name: undefined,
         typingUsers: [],
          messages: [
            {
              author: 1,
              message: 'Hello, user!',
              date: '02.08.2017 20:00',
              viewedBy: [],
            },
            {
              author: 2,
              message: 'Hello, Daniil!',
              date: '02.08.2017 20:01',
              isRead: true,
            },
            {
              author: 1,
              message: 'Bye!',
              date: '02.08.2017 20:02',
              isRead: true,
            },
            {
              author: 2,
              message: 'Some other message',
              date: '02.08.2017 20:03',
              isRead: false,
            },
          ],
        },
        {
          id: 2,
          participants: [1, 3],
          name: 'Work',
          messages: [
            {
              author: 1,
              message: 'Hello!',
              date: '02.08.2017 20:04',
              isRead: true,
            },
            {
              author: 3,
              message: 'Hello',
              date: '02.08.2017 20:05',
              isRead: true,
            },
            {
              author: 1,
              message: 'Lets be a friends!',
              date: '02.08.2017 20:06',
              isRead: true,
            },
            {
              author: 3,
              message: 'OK',
              date: '02.08.2017 20:07',
              isRead: false,
            },
          ],
        },
        {
          id: 3,
          participants: [1, 2, 3],
          name: undefined,
          messages: [
            {
              author: 1,
              message: 'Hello!',
              date: '02.08.2017 20:04',
              isRead: true,
            },
            {
              author: 2,
              message: 'Hello :)',
              date: '02.08.2017 20:04',
              isRead: true,
            },
            {
              author: 2,
              message: 'Very long message! Very long message! Very long message! Very long message! Very long message! Very long message! Very long message! Very long message! Very long message! Very long message! Very long message! Very long message! Very long message! Very long message! Very long message! Very long message! Very long message! Very long message! Very long message! Very long message! Very long message!',
              date: '02.08.2017 20:04',
              isRead: true,
            },
            {
              author: 3,
              message: 'Hello',
              date: '02.08.2017 20:05',
              isRead: true,
            },
            {
              author: 1,
              message: 'Lets be a friends!',
              date: '02.08.2017 20:06',
              isRead: true,
            },
            {
              author: 3,
              message: 'OK',
              date: '02.08.2017 20:07',
              isRead: false,
            },
          ],
        }, */
      ],
      isLoading: false,
      error: null,
      newRedirect: null,
    },
  },
  composeWithDevTools(applyMiddleware(...middleware)),
);

const socket = io.connect('http://localhost:3001');

socket.on('new message', (data) => {
  console.log('message_data: ', data);
  console.log('document.visibilityState:', document.visibilityState);
  store.dispatch(newMessage(data));
  if (document.visibilityState === 'visible') {
    socket.emit('view', {
      userID: store.getState().users.userID,
      password: store.getState().users.list
        .find(u => u.id === store.getState().users.userID).password,
      dialogID: data.dialogID,
      messageID: data.message.id,
    });
  }
});

socket.on('new view', (data) => {
  console.log('New view: ', data);
  store.dispatch(newView(data));
});

socket.on('typing start', (data) => {
  console.log('typing_start: ', data);
  store.dispatch(typingStart(data));
});

socket.on('typing end', (data) => {
  console.log('typing_end: ', data);
  store.dispatch(typingEnd(data));
});


ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <App socket={socket} />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
);