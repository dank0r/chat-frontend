import { withRouter } from 'react-router-dom';

const Redirect = ({ history, isLoggedIn }) => {
  console.log('isLoggedIn: ', isLoggedIn);
  if (isLoggedIn) {
    history.push('/messages');
  } else {
    history.push('/login');
  }
  return null;
};

export default withRouter(Redirect);