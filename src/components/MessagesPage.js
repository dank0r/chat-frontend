import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import RenderMessages from './RenderMessages';
import RenderDialogs from './RenderDialogs';

class MessagesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { dialogID, type, dialogs, user, users, setMenuLink, dispatch, socket } = this.props;
    return (
      <span>
        {dialogID === null ?
          <RenderDialogs dialogs={dialogs} user={user} users={users} setMenuLink={setMenuLink} type={type} dispatch={dispatch} /> :
          (<span>
            <RenderMessages dialogs={dialogs} user={user} dialogID={dialogID} users={users} dispatch={dispatch} socket={socket} />

          </span>)
        }
        </span>
    );
  }
}

export default MessagesPage;