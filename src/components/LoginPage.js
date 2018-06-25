import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { authorization } from '../actions';

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

const form = {
  display: 'inline-block',
  maxHeight: 300,
  minWidth: 500,
  padding: 20,
  backgroundColor: 'white',
  border: '5px solid #b5b5b5',
  borderRadius: '10px',
};

const label = {
  position: 'fixed',
  top: '10vh',
};

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }
  componentDidMount() {
    document.title = 'Login';
    const { authorization, isLoggedIn, users } = this.props;
    if (localStorage.getItem('uuid') && !isLoggedIn && !users.isLoading)
    authorization(localStorage.getItem('uuid'));
  }
  render() {
    const { logIn, error, isLoading, isLoggedIn, socket } = this.props;
    console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
    if(isLoggedIn) {
      this.props.history.push('/messages');
    }
  return (
    <div>
      <div style={{...container, height: '33vh'}}>
        <h1>Chat</h1>
      </div>
      <div style={{...container, justifyContent: 'flex-start'}}>
        {!isLoading ?
        <div style={form}>
            <div className="form-group">
              <label htmlFor="inputUsername">Username</label>
              <input
                type="text"
                className="form-control"
                id="inputUsername"
                placeholder="Username"
                value={this.state.username}
                onChange={(e) => { this.setState({ username: e.target.value }); }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="inputPassword">Password</label>
              <input
                type="password"
                className="form-control"
                id="inputPassword"
                placeholder="Password"
                value={this.state.password}
                onChange={(e) => { this.setState({ password: e.target.value }); }}
              />
            </div>
          <div className="login_bottom">
            <Link to="/signup">Sign Up</Link>
          {error ? <div className="error">{error}</div> : null}
            <button
              className="btn btn-default"
              onClick={() => {
                console.log('this.state.username: ', this.state.username);
                console.log('this.state.password: ', this.state.password);
                logIn(this.state.username, this.state.password);
                //logIn('danya296', 'mytestpassword');
              }}
            >
              Log In
            </button>
            </div>
        </div>
          : <div className="rotate-shadows"></div>
        }
      </div>
    </div>
  );
}
}


export default withRouter(LoginPage);