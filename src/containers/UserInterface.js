import { connect } from 'react-redux';
import UI from '../components/UI';

const mapStateToProps = (state) => ({
  ...state,
  isLoggedIn: !!state.users.userID,
});

export default connect(mapStateToProps)(UI);