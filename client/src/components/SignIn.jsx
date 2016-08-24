import React from 'react';
import { Button } from 'react-bootstrap';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
  }

  login() {
    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
      console.log('chrome identity token:', token);
      fetch('http://ec2-52-43-234-146.us-west-2.compute.amazonaws.com/auth', {
        method: 'POST',
        body: JSON.stringify({token: token}),
        mode: 'cors-with-forced-preflight',
        headers: {'Content-Type': 'application/json'}
      })
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (data.url) {
          // not found in database, so go to googleCal web auth url that is returned from server
          location.assign(data.url);
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('channel', data.channel);
          location.reload();
        }
      });
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('channel');
    // need to tell backend that we have logged out and that the current subscribed channel is no longer valid and to start polling for a new channel
    // or no log out button and they just have to uninstall the extension
    location.reload();
  }

  render() {
    let signInButton = <img className="signin" src="/assets/google_signin.png" onClick={this.login}/>

    return (
      <div>
        {localStorage.getItem('token') ? null : signInButton}
      </div>
    )
  }
}

export default SignIn;
