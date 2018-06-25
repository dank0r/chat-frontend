import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import './index.css';
import MessagesLoader from '../MessagesLoader/MessagesLoader.js';
import { addPost, fetchPostsOf, fetchSocial, fetchUser, subscribe, unsubscribe, changeStatus } from '../../actions';

class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPostValue: '',
      initialPostsFetch: false,
      initialSocialFetch: false,
      isUserFetched: false,
      status: '',
      statusInput: false,
    };
    this.userStatus = this.userStatus.bind(this);
  }
  componentDidMount() {
    const {
      userID,
      users,
      dispatch,
      posts,
    } = this.props;
    dispatch(fetchUser(userID)).then((data) => {
      console.log('data: ', data);
      const displayedUser = this.props.users.list.find(u => u.id === userID);
      this.setState({ status: displayedUser.status });
      document.title = `${displayedUser.firstname} ${displayedUser.lastname}`;
      this.setState({ isUserFetched: true });
    });

    if (!this.state.initialPostsFetch && !posts.isLoading) {
      this.setState({ initialPostsFetch: true });
      dispatch(fetchPostsOf(userID, 10, posts.list.length));
    }

    if (!this.state.initialSocialFetch) {
      this.setState({ initialSocialFetch: true });
      dispatch(fetchSocial(userID)).then(() => {
        dispatch(fetchSocial(users.userID));
      });
    }
  }
  componentDidUpdate() {
    const {
      userID,
      dispatch,
      posts,
    } = this.props;
    window.onscroll = () => {
      const scroll = (window.pageYOffset || document.documentElement.scrollTop) +
        document.documentElement.clientHeight;
      // console.log('scroll: ', scroll);
      // console.log('document.body.scrollHeight: ', document.body.scrollHeight);
      if (scroll > document.body.scrollHeight - 200 && !posts.isLoading) {
        dispatch(fetchPostsOf(userID, 10, posts.list.length));
      }
    };
  }
  userStatus() {
    const {
      userID,
      users,
      user,
      dispatch,
    } = this.props;
    const displayedUser = users.list.find(u => u.id === userID);
    if (displayedUser.friends.indexOf(user.id) !== -1) {
      return (
        <div>
          <div className="left-status">Your friend</div>
          <RaisedButton
            label="Unsubscribe"
            backgroundColor="#337ab7"
            fullWidth
            labelColor="#ffffff"
            onTouchTap={() => {
              dispatch(unsubscribe(displayedUser.id, users.userID, localStorage.getItem('uuid')));
            }}
          />
        </div>
      );
    } else if (displayedUser.subscribers.indexOf(user.id) !== -1) {
      return (
        <div>
          <div className="left-status">Request sent</div>
          <RaisedButton
            label="Unsubscribe"
            backgroundColor="#337ab7"
            fullWidth
            labelColor="#ffffff"
            onTouchTap={() => {
              dispatch(unsubscribe(displayedUser.id, users.userID, localStorage.getItem('uuid')));
            }}
          />
        </div>
      );
    } else if (displayedUser.subscriptions.indexOf(user.id) !== -1) {
      return (
        <div>
          <div className="left-status">Your subscriber</div>
          <RaisedButton
            label="Add to Friends"
            backgroundColor="#337ab7"
            fullWidth
            labelColor="#ffffff"
            onTouchTap={() => {
              dispatch(subscribe(displayedUser.id, users.userID, localStorage.getItem('uuid')));
            }}
          />
        </div>
      );
    }
    return (
      <RaisedButton
        label="Add to Friends"
        backgroundColor="#337ab7"
        fullWidth
        labelColor="#ffffff"
        onTouchTap={() => {
            dispatch(subscribe(displayedUser.id, users.userID, localStorage.getItem('uuid')));
          }}
      />
    );
  }
  render() {
    const {
      userID,
      users,
      user,
      posts,
      dispatch,
    } = this.props;
    const displayedUser = users.list.find(u => u.id === userID);
    console.log('posts: ', posts);

    if (!this.state.isUserFetched) {
      return null;
    }

    return (
      <div>
        <div className="left-content">
          <div className="left-no-avatar" style={{ marginTop: 0 }}>
            {displayedUser.firstname[0]}
          </div>
          {userID !== users.userID ?
            <div className="left-friendship" style={{ marginTop: 0 }}>
              {this.userStatus()}
            </div>
            : null
          }
          <div className="left-friends">
            <div className="friends-title"><Link to={`/friends/${displayedUser.id}`}>Friends</Link> <span>{displayedUser.friends.length}</span></div>
            {displayedUser.friends.length !== 0 ?
              (<div className="users">{
              users.list.filter(u => displayedUser.friends.some(f => f === u.id)).map(u => (
                <div className="user">
                  <Link to={`/id${u.id}`}>
                    <div>
                      <Avatar>{u.firstname[0]}</Avatar>
                    </div>
                    <div>
                      <span style={{ margin: 10, color: '#0074D9' }} className="name">
                        {u.firstname}
                      </span>
                    </div>
                  </Link>
                </div>
              ))
              }</div>)

              : (
                <div className="have-no-friends">
                  <div>{`${user.id === userID ? 'You have' : `${displayedUser.firstname} has`} no friends :(`}</div>
                  <div>Be the first!</div>
                </div>
            )}
          </div>
        </div>
        <div className="right-content">
          <div className="right-info">
            <div className="right-info-name">{`${displayedUser.firstname} ${displayedUser.lastname}`}</div>
            <div>
              {this.state.statusInput && displayedUser.id === user.id ?
                <div className="user-status">
                  <TextField
                    ref={(node) => { this.input = node; }}
                    hintText="Write your status here"
                    value={this.state.status}
                    onChange={(e) => { this.setState({ status: e.target.value }); }}
                  />
                  <i
                    className="clickable-icon fa fa-check fa-lg"
                    onClick={() => {
                      dispatch(changeStatus(this.state.status, user.id, localStorage.getItem('uuid')));
                      this.setState({ statusInput: false });
                    }}
                  />
                  <i
                    className="clickable-icon fa fa-ban fa-lg"
                    onClick={() => {
                      this.setState({ statusInput: false });
                    }}
                  />
                </div>
                :
                <div>
                  {user.status === '' && displayedUser.id === user.id ?
                    <div
                      className="user-status"
                      onClick={() => {
                        this.setState({ statusInput: true }, () => {
                          this.input.focus();
                        });
                      }}
                    >
                      Add status
                    </div>
                    :
                    <div>
                      <span className="user-status">{displayedUser.status}</span>
                      {displayedUser.id === user.id ?
                        <i
                          className="clickable-icon fa fa-pencil fa-lg"
                          onClick={() => {
                            this.setState({ statusInput: true }, () => {
                              this.input.focus();
                            });
                          }}
                        />
                      : null
                      }
                    </div>
                  }
                </div>

              }
            </div>
            <div className="right-info-stats">
              <div>
                <div>{displayedUser.friends.length}</div>
                <div>Friends</div>
              </div>
              <div>
                <div>{displayedUser.subscribers.length}</div>
                <div>Subscribers</div>
              </div>
              <div>
                <div>{displayedUser.subscriptions.length}</div>
                <div>Subscriptions</div>
              </div>
            </div>
          </div>
          {userID === users.userID ?
            <div className="right-new-post">
              <Avatar
                style={{ margin: 5, flexShrink: 0 }}
                size={30}
              >
                {displayedUser.firstname[0]}
              </Avatar>
              <div style={{ width: '100%', marginLeft: 10 }}>
                <TextField
                  hintText={`What are you thinking about, ${displayedUser.firstname}`}
                  multiLine
                  rowsMax={4}
                  style={{ width: '100%' }}
                  value={this.state.newPostValue}
                  onChange={(e) => { this.setState({ newPostValue: e.target.value }); }}
                />
              </div>
              {this.state.newPostValue.length !== 0 ?
                <div>
                  <RaisedButton
                    label="Add"
                    primary
                    style={{ marginLeft: 10 }}
                    onTouchTap={() => {
                      dispatch(addPost(userID, localStorage.getItem('uuid'), this.state.newPostValue));
                      this.setState({ newPostValue: '' });
                    }}
                  />
                </div>
                : null
              }
            </div>
          : null
          }
          {posts.list.map(post => (
            <div className="post" key={`post${post.id}`}>
              <div className="post-author">
                <Avatar
                  style={{ margin: 5, flexShrink: 0 }}
                  size={30}
                >
                  {displayedUser.firstname[0]}
                </Avatar>
                <Link to={`id${post.author}`}>
                  {`${users.list.find(u => u.id === post.author).firstname} ${users.list.find(u => u.id === post.author).lastname}`}
                </Link>
              </div>
              <div className="post-text">{post.text}</div>
            </div>
            ))}
          {posts.list.length === 0 && !posts.isLoading ?
            <div className="right-no-posts">
              {user.id === userID ?
                'You have no posts yet. Add new!' :
                `${displayedUser.firstname} has no posts.`}
            </div>
            : null
          }
          {posts.isLoading ?
            <div className="loader" style={{ outline: 'none', border: 'none', backgroundColor: 'transparent' }}><MessagesLoader /></div>
            : null
          }
        </div>
      </div>
    );
  }
}

UserPage.propTypes = {
  userID: PropTypes.number.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default UserPage;