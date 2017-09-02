import { connect } from 'react-redux';
import SignupPage from '../components/SignupPage';
import { signUp } from '../actions';

const mapStateToProps = (state, ownProps) => ({
  error: state.users.error,
  isLoading: state.users.isLoading,
});

const mapDispatchToProps = (dispatch) => ({
  signUp: (username, firstname, lastname, password) => { dispatch(signUp(username, firstname, lastname, password)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);