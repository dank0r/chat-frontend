import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import './index.css';

import { fetchSocial, fetchUser, unsubscribe, subscribe } from '../../actions';

class FriendsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
    };
    this.buttonTitle = this.buttonTitle.bind(this);
  }
  componentDidMount() {
    const { type, dispatch, userID } = this.props;
    dispatch(fetchUser(userID)).then((res) => {
      const user = res.response;
      let title = '';
      switch (type) {
        case 1:
          title = 'Friends';
          break;
        case 2:
          title = 'Subscribers';
          break;
        case 3:
          title = 'Subscriptions';
          break;
        default:
          return null;
      }
      document.title = `${title} of ${user.firstname} ${user.lastname}`;
      dispatch(fetchSocial(userID));
      return null;
    });
  }
  buttonTitle() {
    switch (this.props.type) {
      case 1:
        return 'Unsubscribe';
      case 2:
        return 'Add to friends';
      case 3:
        return 'Unsubscribe';
      default:
        return null;
    }
  }
  render() {
    const {
      displayedUsers,
      users,
      type,
      isButtonVisible,
      dispatch,
    } = this.props;
    const filteredUsers = displayedUsers
      .filter(d =>
        (d.firstname.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1 ||
        d.lastname.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1));
    console.log('displayedUsers: ', displayedUsers);
    return (
      <div
        className="content"
        style={{
          marginTop: 110,
          minHeight: 'calc(100vh - 111px)',
        }}
      >
        <div className="dialogs_top_bar">
          <div className="dialogs_top_bar_content">
            <div className="dialogs_search">
              <span><i className="fa fa-search" /></span>
              <input
                type="text"
                placeholder="Search"
                className="dialogs_search_input"
                ref={(node) => { this.searchInput = node; }}
                value={this.state.searchValue}
                onChange={(e) => { this.setState({ searchValue: e.target.value }); }}
              />
            </div>
            <div
              role="button"
              tabIndex={-1}
              className="dialogs_add"
              onClick={() => {
                this.searchInput.focus();
                this.setState({ searchValue: '' });
              }}
            >
              <i className="fa fa-times" />
            </div>
          </div>
        </div>
        {displayedUsers.length !== 0 ?
          filteredUsers.map(user => (
            <div
              key={user.id}
              className="user_card"
            >
              <div>
                <Link to={`/id${user.id}`}>
                  <Avatar>{user.firstname[0]}</Avatar>
                  <span style={{ margin: 10, color: '#0074D9' }} className="name">
                    {`${user.firstname} ${user.lastname}`}
                  </span>
                </Link>
              </div>
              {isButtonVisible ?
                <div className="button">
                  <RaisedButton
                    label={this.buttonTitle()}
                    backgroundColor="#337ab7"
                    fullWidth
                    labelColor="#ffffff"
                    onTouchTap={() => {
                      if (type === 2) {
                        dispatch(subscribe(user.id, users.userID, localStorage.getItem('uuid')));
                      } else {
                        dispatch(unsubscribe(user.id, users.userID, localStorage.getItem('uuid')));
                      }
                    }}
                  />
                </div>
                : null
              }
            </div>
          ))
          :
          <div className="no_dialogs">
            <div style={{ textAlign: 'center' }}>
              <div>Nothing to show</div>
            </div>
          </div>
        }
        {displayedUsers.length !== 0 && filteredUsers.length === 0 ?
          <div className="no_dialogs">
            <div style={{ textAlign: 'center' }}>
              <div>{`No users ${this.state.searchValue ? `filtered by '${this.state.searchValue}'` : ' '}`}</div>
            </div>
          </div>
          : null
        }
      </div>
    );
  }
}

FriendsPage.propTypes = {
  type: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  userID: PropTypes.number.isRequired,
  displayedUsers: PropTypes.arrayOf(PropTypes.object).isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  isButtonVisible: PropTypes.bool.isRequired,
};

export default withRouter(FriendsPage);