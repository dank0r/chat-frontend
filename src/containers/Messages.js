import { connect } from 'react-redux';
import MessagesPage from '../components/MessagesPage';

const mapStateToProps = (state, ownProps) => ({
  error: state.dialogs.error,
  isLoading: state.dialogs.isLoading,
});

export default connect(mapStateToProps)(MessagesPage);