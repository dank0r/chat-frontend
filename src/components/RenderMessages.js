import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import { newMessage, fetchMessages, newView } from '../actions';
import MessagesLoader from './MessagesLoader/MessagesLoader.js';

let time = 0;
let interval;

class RenderMessages extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.viewAll = this.viewAll.bind(this);
  }
  componentWillMount() {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }
  componentDidMount() {
    const {dialogID, user, socket, dispatch, dialogs } = this.props;
    const messages = dialogs.list.find(d => d.id === dialogID).messages;

    document.title = 'Messages';

    if (messages.length < 2 && !dialogs.isLoading) {
      console.log(456);
      dispatch(fetchMessages(user, dialogID, messages.length, 10));
    }

    console.log('(window.pageYOffset || document.documentElement.scrollTop): ', (window.pageYOffset || document.documentElement.scrollTop));



    interval = setInterval(() => {
      time += 100;
      if (time === 2000) {
        socket.emit('typing end', {
          userID: user.id,
          password: user.password,
          dialogID,
        });
      }
    }, 100);

    //window.onload = function () {
      //window.scrollTo(0, document.body.scrollHeight);
    //};

    //setTimeout(() => {
      //window.scrollTo(0, document.body.scrollHeight);
    //}, 50);
    if (document.getElementById('newest_message'))
    document.getElementById( 'newest_message' ).scrollIntoView();
  }
  componentDidUpdate(prevProps) {
    const {dialogID, dialogs, dispatch, user } = this.props;
    const messages = dialogs.list.find(d => d.id === dialogID).messages;

    const dialogs2 = prevProps.dialogs;
    const messages2 = dialogs2.list.find(d => d.id === dialogID).messages;

    this.viewAll();

    console.log('dialogs.isLoading: ', dialogs.isLoading);
    window.onscroll = () => {
      let scroll = (window.pageYOffset || document.documentElement.scrollTop);
      if(scroll < 100 && scroll > 50 && !dialogs.isLoading) {
        dispatch(fetchMessages(user, dialogID, messages.length, 10));
      }
    };

    let typeOfChange;
    if (messages[messages.length - 1] === messages2[messages2.length - 1] && messages[0] !== messages2[0]) {
      typeOfChange = 'fetch';
    }
    if (messages[messages.length - 1] !== messages2[messages2.length - 1] && messages[0] === messages2[0]) {
      typeOfChange = 'new message';
    }
    if (messages[messages.length - 1] === messages2[messages2.length - 1] && messages[0] === messages2[0]) {
      typeOfChange = 'other';
    }

    if(typeOfChange === 'new message') {
      window.scrollTo(0, document.body.scrollHeight);
    }
    if(typeOfChange === 'fetch') {
      window.scrollTo(0, 1000);
    }

  }
  viewAll() {
    const {dialogID, dialogs, user, dispatch, socket } = this.props;
    const messages = dialogs.list.find(d => d.id === dialogID).messages;
    if (document.visibilityState === 'visible') {
      messages.forEach((m) => {
        if (!m.viewedBy.some(vb => vb === user.id)) {
          socket.emit('view', {
            userID: user.id,
            password: user.password,
            dialogID: dialogID,
            messageID: m.id,
          });
          dispatch(newView({
            userID: user.id,
            dialogID,
            messageID: m.id,
          }));
        }
      });
    }
  }
  render() {
    console.log('RenderMessages!');
    const {dialogID, dialogs, user, users, dispatch, socket } = this.props;
    console.log('dialogs in Messages: ', dialogs);
    const messages = dialogs.list.find(d => d.id === dialogID).messages;
    const messages2 = messages.concat(messages).concat(messages).concat(messages).concat(messages);
    const typingUsers = dialogs.list.find(d => d.id === dialogID).typingUsers || [];
    const dialog = dialogs.list.find(d => d.id === dialogID);
    document.addEventListener("visibilitychange", this.viewAll, false);

    return (
      <div className="content">
        <div className="messages">
          <div className="messages_block_top"></div>
          <div className="messages_top_bar">
            <Link to="/messages" className="messages_back_button">{'<-Back'}</Link>
            <div className="messages_name">{
              dialog.name ||
              dialog.participants
                .filter(id => !!dialog.usersWhoLeft && !dialog.usersWhoLeft.some(uid => uid === id))
                .map(id => `${users.list.find(u => u.id === id).firstname} ${users.list.find(u => u.id === id).lastname}`).join(', ') ||
                'No participants'
            }</div>
            <div className="messages_preview">

              {dialog.participants.length > 0 ?
                dialog.participants.map(id => (
                  <Link to={`/id${id}`}>
                  <Avatar style={{ margin: 5 }}>
                    {users.list.find(u => u.id === id).firstname[0]}
                  </Avatar>
                  </Link>
                ))
                :
                <Link to={`/id${user.id}`}>
                  <Avatar style={{ margin: 5 }}>
                    {user.firstname[0]}
                  </Avatar>
                </Link>
              }

            </div>
          </div>
          <div className="empty_message"></div>
          <div className="empty_message"></div>
          {dialogs.isLoading ?
            <div>
              <div className="empty_message"></div>
              <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <MessagesLoader/>
              </div>
              <div className="empty_message"></div>
            </div>
            : null}
          {dialogs.error !== null ? <div><div className="error">{dialogs.error}</div></div> : null}
          {messages.map((msg) => {
            const firstname = users.list.find(u => u.id === msg.author).firstname;
            const lastname = users.list.find(u => u.id === msg.author).lastname;
            return (
              <div className="message" key={`message${messages.indexOf(msg)}`} id={messages.indexOf(msg) === messages.length - 1 ? 'newest_message' : `message${messages.indexOf(msg)}`}>
                <Link to={`/id${msg.author}`}><Avatar>{firstname[0]}</Avatar></Link>
                <div className="message_text">{msg.message}</div>
                <Link to={`/id${msg.author}`}><span className="message_name">{`${firstname} ${lastname}`}</span></Link>
                <div className="message_viewed">
                  {
                  msg.viewedBy.filter(v => v !== user.id && v !== msg.author).length === 0 ?
                    '' :
                    `Viewed by: ${msg.viewedBy.filter(v => v !== user.id && v !== msg.author).map(id =>
                        `${users.list.find(u => u.id === id).firstname} ${users.list.find(u => u.id === id).lastname}`
                      ).join(', ')}`
                  }
                </div>
              </div>
            );
          })}
          <div>
            {typingUsers.length !== 0 ? typingUsers.map((tu) => {
              const firstname = users.list.find(u => u.id === tu).firstname;
              const lastname = users.list.find(u => u.id === tu).lastname;
              return (
                <div className="message" key={`typing${tu}`}>
                  {`${firstname} ${lastname} is typing...`}
                </div>
              );
            })
              :
              <div className="message">
                {` `}
              </div>
            }
          </div>
          <div className="empty_message"></div>
          <div className="empty_message"></div>
          <div className="messages_input">
            <div className="messages_input_content">
            <input
              disabled={dialog.participants.filter(p => !dialog.usersWhoLeft.some(u => u === p)).length === 0}
              type="text"
              placeholder={
              dialog.participants.filter(p => !dialog.usersWhoLeft.some(u => u === p)).length === 0 ?
              'There are no participants other than you' :
              'Write a message...'
              }
              style={{ padding: 10, margin: 10, width: '80%' }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value !== '') {
                  /*dispatch(newMessage({
                    dialogID,
                    message: {
                      author: user.id,
                      message: e.target.value,
                      viewedBy: [],
                    }}));*/
                  socket.emit('typing end', {
                    userID: user.id,
                    password: user.password,
                    dialogID,
                  });
                  socket.emit('message', {
                    userID: user.id,
                    password: user.password,
                    dialogID,
                    message: {
                      author: user.id,
                      message: e.target.value,
                    }
                  });
                  e.target.value = '';
                  window.scrollTo(0, document.body.scrollHeight);
                } else {
                time = 0;
                  socket.emit('typing start', {
                    userID: user.id,
                    password: user.password,
                    dialogID,
                  });
                }
              }}
            />
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RenderMessages;