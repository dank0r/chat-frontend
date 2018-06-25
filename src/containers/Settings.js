import { connect } from 'react-redux';
import SettingsPage from '../components/SettingsPage';

const mapStateToProps = (state, ownProps) => ({
  users: state.users,
  user: state.users.list.find(u => u.id === state.users.userID),
});

export default connect(mapStateToProps)(SettingsPage);