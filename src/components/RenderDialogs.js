import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import RenderCreateDialog from './RenderCreateDialog';
import { fetchDialogs, removeDialog } from '../actions';

class RenderDialogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
    };
    this.unread = this.unread.bind(this);
  }
  unread(dialogs) {
    const { user } = this.props;
    return dialogs.filter(d => d.messages.some(m => !m.viewedBy.some(vb => vb === user.id)));
  }
  componentDidMount() {
    const { dispatch, dialogs, user } = this.props;

    document.title = 'Messages';

    console.log('fetchingDialogs: ', dialogs);
    console.log('fetchingUser: ', user);
    dispatch(fetchDialogs(user, dialogs.list.length, 10));
  }
  render() {
    const { dialogs, user, users, setMenuLink, type, dispatch, history } = this.props;
    const filteredDialogs = dialogs.list
      .filter(d =>
      (d.name.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1 ||
      !!users.list.filter(u =>
        d.participants.some(p => p === u.id))
        .some(u => u.firstname.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1) ||
      !!users.list.filter(u =>
        d.participants.some(p => p === u.id))
        .some(u => u.lastname.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1))
    );
    console.log('dialogs1: ', dialogs);

    if (type === 1 || type === 2)
    return (
    <div className="content" style={{
        marginTop: 110,
        minHeight: 'calc(100vh - 111px)',
      }}>
      <div className="dialogs_top_bar">
        <div className="dialogs_top_bar_content">
          <div className="dialogs_search">
            <span><i className="fa fa-search"></i></span>
            <input
              type="text"
              placeholder="Search"
              className="dialogs_search_input"
              ref={(node) => { this.searchInput = node; }}
              value={this.state.searchValue}
              onChange={(e) => { this.setState({ searchValue: e.target.value }); }}
              />
          </div>
            <div className="dialogs_add" onClick={() => {
              this.searchInput.focus();
              if (this.state.searchValue.length === 0) {
                setMenuLink(3);
              } else {
                this.setState({ searchValue: '' });
              }
            }}>
              {this.state.searchValue.length === 0 ?
                <i className="fa fa-plus"  style={{ transform: 'rotate(0deg)', transition: '0.3s' }}></i>
                : <i className="fa fa-plus" style={{ transform: 'rotate(45deg)', transition: '0.3s' }}></i>
              }
            </div>
        </div>
      </div>
      {dialogs.list.length !== 0 ? (type === 1 ? filteredDialogs : this.unread(filteredDialogs))
        .map((dialog) => (
          <div
            className="dialog"
            key={dialog.id}
            style={{
              borderBottom: dialogs.list.indexOf(dialog) === dialogs.list.length - 1 ? 'none' : '1px dashed #dadada',
              padding: 0,
              backgroundColor: this.unread(dialogs.list).indexOf(dialog) !== -1 ? '#c6c6c6' : 'white',
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
                  dialog.participants.filter(id => id !== user.id && !dialog.usersWhoLeft.some(u => u === id))
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
      {type === 2 && this.unread(filteredDialogs).length === 0 ?
        <div className="no_dialogs">
          <div style={{ textAlign: 'center' }}>
            <div>{`You have no unread messages ${this.state.searchValue ? `filtered by '${this.state.searchValue}'` : ' '}`}</div>
          </div>
        </div>
        : null
      }
      {type === 1 && dialogs.list.length !== 0 && filteredDialogs.length === 0 ?
        <div className="no_dialogs">
          <div style={{ textAlign: 'center' }}>
            <div>{`You have no dialogs ${this.state.searchValue ? `filtered by '${this.state.searchValue}'` : ' '}`}</div>
          </div>
        </div>
        : null
      }
    </div>
  );
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