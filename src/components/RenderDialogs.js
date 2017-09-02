import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import RenderCreateDialog from './RenderCreateDialog';
import { fetchDialogs, fetchUsers, removeDialog } from '../actions';

class RenderDialogs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    const { dispatch, dialogs, user } = this.props;
    console.log('fetchingDialogs: ', dialogs);
    console.log('fetchingUser: ', user);
    dispatch(fetchDialogs(dialogs, user));
  }
  render() {
    const { dialogs, user, users, setMenuLink, type, dispatch, history } = this.props;
    console.log('dialogs1: ', dialogs);
    console.log('type: ', type);

    let usersToFetch = [];
    dialogs.list.map(d =>
        d.participants.map(p => {
          if (p !== user.id && !usersToFetch.some(utf => utf  === p))
            usersToFetch.push(p);
        })
          .concat(d.messages.map(m => {
            if (m.author !== user.id && !usersToFetch.some(utf => utf  === m.author))
              usersToFetch.push(m.author);
          }))

    );
    usersToFetch = usersToFetch.filter(utf => !users.list.some(u => utf === u.id));
    if (usersToFetch.length !== 0 && !users.isLoading) {
      console.log('usersToFetch: ', usersToFetch);
      dispatch(fetchUsers(usersToFetch));
      return null;
    }

    if (type === 1)
    return (
    <div className="content" style={{
        marginTop: 110,
        minHeight: 'calc(100vh - 111px)',
      }}>
      <div className="dialogs_top_bar">
        <div className="dialogs_top_bar_content">
          <div className="dialogs_search">
            <span><i className="fa fa-search"></i></span>
            <input type="text" placeholder="Search" className="dialogs_search_input"/>
          </div>
          <div className="dialogs_add" onClick={() => {
              setMenuLink(3);
            }}>
            <i className="fa fa-plus"></i>
          </div>
        </div>
      </div>
      {dialogs.list.length !== 0 ? dialogs.list.map((dialog) => (
          <div
            className="dialog"
            key={dialog.id}
            style={{
              borderBottom: dialogs.list.indexOf(dialog) === dialogs.list.length - 1 ? 'none' : '1px dashed #dadada',
              padding: 0,
            }}
          >
            <div
              className="dialog"
              style={{ width: '100%', height: '100%', border: 'none' }}
              onClick={() => {
                history.push(`/messages/${dialog.id}`);
              }}
            >
            <Avatar>{
              users.list.find(u => u.id === dialog.participants.find(id => id !== user.id)) ?
              users.list.find(u => u.id === dialog.participants.find(id => id !== user.id)).firstname[0]
                : user.firstname[0]
            }</Avatar>
              <span className="dialog_name">
                {dialog.name ? dialog.name :
                  dialog.participants.filter(id => id !== user.id)
                    .map(id =>
                      users.list.find(u => u.id === id) ?
                        `${users.list.find(u => u.id === id).firstname} ${users.list.find(u => u.id === id).lastname}`
                        : null
                  ).join(', ')
                  || 'No participants'
                }
              </span>
              <span className="dialog_message">
                {dialog.messages.length !== 0 ? dialog.messages[dialog.messages.length - 1].message : null}
              </span>
              <span className="dialog_date">
                {dialog.messages.length !== 0 ? dialog.messages[dialog.messages.length - 1].date : null}
              </span>
              </div>
              <div
                className="dialog_close"
              >
                <i className="fa fa-times" onClick={() => { dispatch(removeDialog(user, dialog.id)); }}></i>
              </div>
          </div>

      ))
        :
        <div className="no_dialogs">
          <div style={{ textAlign: 'center' }}>
            <div>You have no dialogs yet :(</div>
            <br />
            <a href="#" onClick={() => { setMenuLink(3); }} >Create one</a>
          </div>
        </div>
      }
    </div>
  );
    if (type === 2)
    return null;
    if (type === 3)
    return (
      <RenderCreateDialog
        thisUser={user}
        users={users}
        setMenuLink={setMenuLink}
        type={type}
        dispatch={dispatch}
      />
    );
  }
}

export default withRouter(RenderDialogs);