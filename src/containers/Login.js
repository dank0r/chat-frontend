import { connect } from 'react-redux';
import LoginPage from '../components/LoginPage';
import { logIn, authorization } from '../actions';

const mapStateToProps = (state, ownProps) => ({
  error: state.users.error,
  users: state.users,
  isLoading: state.users.isLoading,
  isLoggedIn: !!state.users.userID,
});

const mapDispatchToProps = (dispatch) => ({
  logIn: (username, password) => { dispatch(logIn(username, password)); },
  authorization: (session) => { dispatch(authorization(session)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);