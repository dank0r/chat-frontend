import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from '../containers/Login';
import Signup from '../containers/Signup';
import UserInterface from '../containers/UserInterface';
import Redirect from './Redirect';

const App = ({ history, isLoggedIn, socket }) => (
  <div>
    <Router>
      <Switch>
        <Route exact path="/login" render={() => (<Login socket={socket} />)} />
        <Route exact path="/signup" render={() => (<Signup socket={socket} />)} />
        <Route exact path="/messages/:dialogID" render={({match}) => (
          <UserInterface page={{ type: 'messages', mediaID: parseInt(match.params.dialogID, 10) }} socket={socket} />
        )} />
        <Route exact path="/messages" render={() => (
          <UserInterface page={{ type: 'messages', mediaID: null }} socket={socket} />
        )} />
        <Route path="/" render={() => (<Redirect isLoggedIn={isLoggedIn} />)} />
      </Switch>
    </Router>
  </div>
);

const mapStateToProps = (state) => ({
  isLoggedIn: !!state.users.userID,
});

export default connect(mapStateToProps)(App);