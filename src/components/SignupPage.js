import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, submit } from 'redux-form';

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
  maxHeight: 700,
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




class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      firstname: '',
      lastname: '',
      password: '',
    };
  }
  render() {
    const { signUp } = this.props;
    return (
      <div>
        <div style={{...container, height: '33vh'}}>
          <h1>Chat</h1>
        </div>
        <div style={{...container, justifyContent: 'flex-start'}}>
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
                <label htmlFor="inputFname">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="inputFname"
                  placeholder="First name"
                  value={this.state.firstname}
                  onChange={(e) => { this.setState({ firstname: e.target.value }); }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="inputLname">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="inputLname"
                  placeholder="Last name"
                  value={this.state.lastname}
                  onChange={(e) => { this.setState({ lastname: e.target.value }); }}
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
              <Link to="/login" style={{position: 'relative', top: 10}}>Log In</Link>
              <button
                type="submit"
                className="btn btn-default"
                style={{float: 'right'}}
                onClick={() => {
                signUp(this.state.username, this.state.firstname, this.state.lastname, this.state.password);
              }}
              >
                Sign Up
              </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SignupPage;