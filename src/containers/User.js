import { connect } from 'react-redux';
import UserPage from '../components/UserPage/';

const mapStateToProps = (state, ownProps) => ({
  users: state.users,
  user: state.users.list.find(u => u.id === state.users.userID),
  posts: { ...state.posts, list: state.posts.list.filter(p => p.author === ownProps.userID) },
});

export default connect(mapStateToProps)(UserPage);