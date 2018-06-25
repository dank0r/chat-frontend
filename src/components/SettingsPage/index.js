import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import './index.css';
import { fetchUser, changePersonal } from '../../actions';

class FriendsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
    };
  }
  componentDidMount() {
    const { dispatch, users } = this.props;
    dispatch(fetchUser(users.userID)).then((res) => {
      const user = res.response;
      this.setState({
        firstname: user.firstname,
        lastname: user.lastname,
      });
    });
    document.title = 'Settings';
  }
  render() {
    const { users, user, dispatch } = this.props;
    return (
      <div
        className="content"
        style={{
          marginTop: 65,
          minHeight: 'calc(100vh - 65px)',
        }}
      >
        <div className="firstname">
          <TextField
            floatingLabelText="Firstname"
            value={this.state.firstname}
            onChange={(e) => { this.setState({ firstname: e.target.value }); }}
          />
          {user.firstname !== this.state.firstname ?
            <RaisedButton
              label="Save"
              backgroundColor="#337ab7"
              labelColor="#ffffff"
              onTouchTap={() => {
                dispatch(changePersonal({ firstname: this.state.firstname }, users.userID, localStorage.getItem('uuid')));
              }}
            />
            : null}
        </div>
        <div className="firstname">
          <TextField
            floatingLabelText="Lastname"
            value={this.state.lastname}
            onChange={(e) => { this.setState({ lastname: e.target.value }); }}
          />
          {user.lastname !== this.state.lastname ?
            <RaisedButton
              label="Save"
              backgroundColor="#337ab7"
              labelColor="#ffffff"
              onTouchTap={() => {
                dispatch(changePersonal({ lastname: this.state.lastname }, users.userID, localStorage.getItem('uuid')));
              }}
            />
            : null}
        </div>
      </div>
    );
  }
}


FriendsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
  }).isRequired,
};

export default withRouter(FriendsPage);