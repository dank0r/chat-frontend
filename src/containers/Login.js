import { connect } from 'react-redux';
import LoginPage from '../components/LoginPage';
import { logIn } from '../actions';

const mapStateToProps = (state, ownProps) => ({
  error: state.users.error,
  isLoading: state.users.isLoading,
  isLoggedIn: !!state.users.userID,
});

const mapDispatchToProps = (dispatch) => ({
  logIn: (username, password) => { dispatch(logIn(username, password)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);