import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import MessagesPage from './MessagesPage';
import { newRedirectNull } from '../actions';

const container = {
  height: '66vh',
  width: '100vw',
  display: 'flex',
  justifyContent: 'flex-end',
  alignContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  flexDirection: 'column',
};

const loader = (bottom, opacity) => (
  <div
    className="roll"
    style={{ bottom, opacity }}
  >
    <div style={{...container, height: '33vh'}}>
      <h1>Chat</h1>
    </div>
    <div style={{...container, justifyContent: 'flex-start'}}>
      <div className="rotate-shadows"></div>
    </div>
  </div>
);

class UI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: 1,
      iconColor: '#6b98c5',
      bottom: 0,
      opacity: 1,
    };
    this.rightMenu = this.rightMenu.bind(this);
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
    }
  }
  componentDidMount() {
    const user = this.props.users.list.find(u => u.id === this.props.users.userID);
    if(user)
    this.props.socket.emit('authorization', { userID: user.id, password: user.password });

    setTimeout(() => {
      this.setState({ bottom: 1500 });
    }, 2000);
    setTimeout(() => {
      this.setState({ opacity: 0 });
    }, 5000);
  }
  render() {
    const { users, dialogs, page, posts, history, dispatch, isLoggedIn, socket } = this.props;
    console.log('isLoggedIn: ', isLoggedIn);
    if (!this.props.isLoggedIn) {
      this.props.history.push('/login');
      return null;
    }
    if(dialogs.newRedirect !== null) {
      dispatch(newRedirectNull());
      history.push(`/messages/${dialogs.newRedirect}`);
      return null;
    }
    console.log('users: ', users);
    const user = users.list.find(u => u.id === users.userID);
    const { id, username, firstname, lastname } = user;
    return (
      <div>
        {loader(this.state.bottom, this.state.opacity)}
        <div className="header">
          <Link to="/messages">
          <span
            id="logo"
          >
            <h2>Chat</h2>
          </span>
        </Link>
          <span id="search_bar">
            <i className="fa fa-search search_icon" style={{ color: this.state.iconColor }}></i>
            <input
              id="search_input"
              type="text"
              onFocus={() => { this.setState({ iconColor: 'white' }); }}
              onBlur={() => { this.setState({ iconColor: '#6b98c5' }); }}
            />
          </span>
          <span id="notifications" tabIndex="50">
            <i className="fa fa-bell fa-lg"></i>
          </span>
          <div className="dropdown_menu_1">
            <div>123</div>
            <div>234</div>
          </div>
          <span id="profile" tabIndex="51">
            {firstname}
            <Avatar style={{ margin: 5 }} size={30}>{firstname[0]}</Avatar>
            <i className="fa fa-caret-down fa-lg"></i>
            <div className="dropdown_menu_2">
              <div className="dropdown_menu_item" onClick={() => { history.push(`/id${id}`); }}>My page</div>
              <div className="dropdown_menu_item" onClick={() => { history.push('/settings'); }}>Settings</div>
              <div className="dropdown_menu_item" onClick={() => { history.push('/login'); }}>Log out</div>
            </div>
          </span>
        </div>
        <div className="lmenu" id={page.type === 'messages' ? 'lmenu_fixed' : 'lmenu'}>
          <Link to={`/id${id}`}><div className="lmenu_links">My page</div></Link>
          <Link to={`/messages`}><div className="lmenu_links">Messages</div></Link>
          <Link to={`/friends`}><div className="lmenu_links">Friends</div></Link>
          <Link to={`/settings`}><div className="lmenu_links">Settings</div></Link>
        </div>
          {this.rightMenu(page.type)}
        <MessagesPage
          dialogID={page.mediaID}
          type={this.state.menu}
          dialogs={dialogs}
          user={user}
          users={users}
          dispatch={dispatch}
          setMenuLink={(n) => { this.setState({ menu: n }); }}
          socket={socket}
        />
        </div>
    );
  }
}

export default withRouter(UI);