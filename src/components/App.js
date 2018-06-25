import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from '../containers/Login';
import Signup from '../containers/Signup';
import UserInterface from '../containers/UserInterface';
import Messages from '../containers/Messages';
import User from '../containers/User';
import Friends from '../containers/Friends';
import Settings from '../containers/Settings';
import Redirect from './Redirect';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: 1,
    };
    this.rightMenu = this.rightMenu.bind(this);
    this.setMenuLink = this.setMenuLink.bind(this);
  }
  setMenuLink(n) {
    this.setState({ menu: n });
  }
  rightMenu(type) {
    switch(type) {
      case 'messages':
        return (
          <div className="rmenu" id="rmenu">
              <span>
                <div
                  className={`rmenu_links ${this.state.menu === 1 ? 'active_link': ''}`}
                  onClick={() => {
                    this.setState({ menu: 1 });
                  }}
                  >All</div>
                <div
                  className={`rmenu_links ${this.state.menu === 2 ? 'active_link': ''}`}
                  onClick={() => {
                    this.setState({ menu: 2 });
                  }}
                  >Unread</div>
                {this.state.menu === 3 ?
                  <div
                    className="rmenu_links active_link"
                    >Create</div>
                  : null
                }
              </span>
          </div>
        );
      case 'friends':
        return (
          <div className="rmenu" id="rmenu">
            <span>
                <div
                  className={`rmenu_links ${this.state.menu === 1 ? 'active_link': ''}`}
                  onClick={() => {
                    this.setState({ menu: 1 });
                  }}
                  >Friends</div>
                <div
                  className={`rmenu_links ${this.state.menu === 2 ? 'active_link': ''}`}
                  onClick={() => {
                    this.setState({ menu: 2 });
                  }}
                  >Subscribers</div>
              <div
                className={`rmenu_links ${this.state.menu === 3 ? 'active_link': ''}`}
                onClick={() => {
                    this.setState({ menu: 3 });
                  }}
                >Subscriptions</div>
              </span>
          </div>
        );
      case 'settings':
        return (
          <div className="rmenu" id="rmenu">
            <span>
                <div
                  className="rmenu_links"
                  style={{ cursor: 'default' }}
                  onClick={() => {
                    //this.setState({ menu: 1 });
                  }}
                  >General</div>
              </span>
          </div>
        );
      default:
        return null;
    }
  }
  render() {
    const { socket, userID } = this.props;
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/login" render={() => (<Login socket={socket} />)} />
            <Route exact path="/signup" render={() => (<Signup socket={socket} />)} />
            <Route exact path="/messages/:dialogID" render={({match}) => (
              <UserInterface socket={socket}>
              {this.rightMenu('messages')}
                <Messages
                  type={this.state.menu}
                  dialogID={parseInt(match.params.dialogID, 10)}
                  socket={socket}
                  setMenuLink={this.setMenuLink}
                />
              </UserInterface>
        )} />
            <Route exact path="/messages" render={() => (
              <UserInterface socket={socket}>
              {this.rightMenu('messages')}
                <Messages
                  type={this.state.menu}
                  dialogID={null}
                  socket={socket}
                  setMenuLink={this.setMenuLink}
                />
              </UserInterface>
        )} />
            <Route exact path="/friends" render={() => (
              <UserInterface socket={socket}>
              {this.rightMenu('friends')}
                <Friends
                  type={this.state.menu}
                  userID={userID}
                  socket={socket}
                  setMenuLink={this.setMenuLink}
                />
              </UserInterface>
        )} />
            <Route exact path="/friends/:id" render={({ match }) => (
              <UserInterface socket={socket}>
              {this.rightMenu('friends')}
                <Friends
                  type={this.state.menu}
                  userID={parseInt(match.params.id, 10)}
                  socket={socket}
                  setMenuLink={this.setMenuLink}
                />
              </UserInterface>
        )} />
            <Route exact path="/settings" render={() => (
              <UserInterface socket={socket}>
              {this.rightMenu('settings')}
                <Settings
                  type={this.state.menu}
                  socket={socket}
                  setMenuLink={this.setMenuLink}
                />
              </UserInterface>
        )} />
            <Route exact path="/id:id" render={({match}) => (
              <UserInterface socket={socket}>
          <User
          key={parseInt(match.params.id, 10)}
          userID={parseInt(match.params.id, 10)}
          />
          </UserInterface>
        )} />
            <Route path="/" render={() => (<UserInterface socket={socket} redirect={true} />)} />
          </Switch>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: !!state.users.userID,
  posts: state.posts,
  userID: state.users.userID,
});

export default connect(mapStateToProps)(App);