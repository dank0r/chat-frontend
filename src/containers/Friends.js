import React, { Component } from 'react';
import { connect } from 'react-redux';
import FriendsPage from '../components/FriendsPage/';

class Page extends Component {
  constructor(props) {
    super(props);
  }
  componentWillUnmount() {
    this.props.setMenuLink(1);
  }
  render() {
    return (<FriendsPage {...this.props} key={`${this.props.type} ${this.props.userID}`} />);
  }
}

const mapStateToProps = (state, ownProps) => {
  const user = state.users.list.find(u => u.id === ownProps.userID);
  let displayedUsers = [];
  if(user)
  switch(ownProps.type) {
    case 1:
      displayedUsers = state.users.list.filter(u => user.friends.some(u1 => u1 === u.id));
      break;
    case 2:
      displayedUsers = state.users.list.filter(u => user.subscribers.some(u1 => u1 === u.id));
      break;
    case 3:
      displayedUsers = state.users.list.filter(u => user.subscriptions.some(u1 => u1 === u.id));
      break;
    default:
      break;
  }
  return {
    users: state.users,
    user,
    isButtonVisible: ownProps.userID === state.users.userID,
    displayedUsers,
  };
};

export default connect(mapStateToProps)(Page);