import { connect } from 'react-redux';
import MessagesPage from '../components/MessagesPage';

const mapStateToProps = (state, ownProps) => ({
  dialogs: state.dialogs,
  users: state.users,
  user: state.users.list.find(u => u.id === state.users.userID),
  error: state.dialogs.error,
  isLoading: state.dialogs.isLoading,
});

export default connect(mapStateToProps)(MessagesPage);