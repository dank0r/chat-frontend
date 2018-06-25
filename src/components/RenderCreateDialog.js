import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import { createDialog, fetchSocial, fetchRandomUsers } from '../actions';

class DialogOK extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    };
  }
  render() {
    console.log('Alive!: ', this.props);

    const { user, participants, dispatch, setMenuLink } = this.props;
    return (
      <div className="dialogOK" style={{ bottom: participants.length - 1 > 0 ? 0 : -50 }}>
        {participants.length -1 <= 1 ?
          <RaisedButton
            label="Go to the dialog"
            onTouchTap={() => {
              dispatch(createDialog(user, participants, ''));
              setMenuLink(1);
            }}
            primary
            style={{ width: '40%' }}
          />
          : <span className="dialogOK_content">
      <input
        type="text"
        placeholder="Enter the dialog name"
        className="dialogs_search_input"
        value={this.state.name}
        onChange={(e) => { this.setState({ name: e.target.value }); }}
        style={{ width: '60%', margin: 0, padding: 10 }}
      />
      <RaisedButton
        label="Go to the dialog"
        onTouchTap={() => {
          dispatch(createDialog(user, participants, this.state.name));
          setMenuLink(1);
        }}
        primary
        style={{ width: '40%' }}
      />
    </span>
        }
      </div>
    );
  }
}

class RenderCreateDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: [this.props.thisUser.id],
    };
  }
  componentDidMount() {
    if (this.props.thisUser.friends.length === 0) {
      this.props.dispatch(fetchRandomUsers(10, this.props.thisUser.id));
    }
    else
      this.props.dispatch(fetchSocial(this.props.thisUser.id));
  }
  render() {
    const { setMenuLink, thisUser, users, dispatch } = this.props;
    const participants = this.state.participants.filter(p => p !== thisUser.id).map(p => users.list.find(u => u.id === p));
    const users2 = {
      list: users.list.concat(users.list).concat(users.list).concat(users.list).concat(users.list).concat(users.list)
  };
    return (
      <div className="content" style={{
        marginTop: 155,
        minHeight: 'calc(100vh - 155px)',
      }}>
        <DialogOK user={thisUser} participants={this.state.participants} dispatch={dispatch} setMenuLink={setMenuLink} />
          <div className="rmenu" id="rmenu" style={{ top: 200, minHeight: 200 }}>
            <span>
              <div style={{ textAlign: 'center', fontWeight: 'bold', margin: 5 }}>Participants</div>
              {participants.length !== 0 ? participants.map(u => (
                <span className="participant" key={`createDialog.RightMenu.User${u.id}`}>
                  <span>{`${u.firstname} ${u.lastname}`}</span>
                  <span
                    className="participant_delete"
                    onClick={() => { this.setState({ participants: this.state.participants.filter(p => p !== u.id) }); }}
                    ><i className="fa fa-times"></i></span>
                </span>
              ))
              : <span className="participants_empty">Invite new people :)</span>
              }
            </span>
          </div>
        <div className="dialogs_top_bar" style={{
          height: 90
        }}>
          <div className="dialogs_top_bar_content" style={{ height: 40 }}>
            <div style={{ fontWeight: 'bold', margin: 10 }}>Create dialog</div>
            <div className="create_dialog_close" onClick={() => { setMenuLink(1); }}>
              <i className="fa fa-times"></i>
            </div>
          </div>
          <div className="dialogs_top_bar_content"  style={{ height: 50 }}>
            <div className="dialogs_search">
              <span><i className="fa fa-search"></i></span>
              <input type="text" placeholder="Search" className="dialogs_search_input" />
            </div>
          </div>
        </div>
        {users.list.filter(u => u.id !== thisUser.id).map((user, index) => (
            <div
              key={`createDialog.User${user.id}${index}`}
              className="create_dialog_user"
              onClick={() => {
                if (this.state.participants.indexOf(user.id) === -1) {
                  this.setState({ participants: this.state.participants.concat(user.id) });
                } else {
                  this.setState({ participants: this.state.participants.filter(p => p !== user.id) });
                }
              }}
            >
              <div>
              <Avatar>{user.firstname[0]}</Avatar>
              <span style={{ margin: 10, color: '#0074D9' }}>
                {`${user.firstname} ${user.lastname}`}
              </span>
                </div>
              <span className="user_checkbox">
                <i className={`fa ${this.state.participants.indexOf(user.id) === -1 ? 'fa-circle-thin' : 'fa-check-circle'} fa-2x`}></i>
              </span>
            </div>

        ))}
      </div>);
  }
}

export default RenderCreateDialog;