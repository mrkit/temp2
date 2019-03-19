import React, { Component } from 'react';
import { client_id } from './.env';

class Login extends Component {
  state = {}
  
  componentDidMount(){
  }

  handleSubmit = e => {
    e.preventDefault();
    const username = e.target.username.value;
    
    window.location = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo gist&login=${username}`
  }

  render(){
    const { handleSubmit } = this;
    
    return (
      <form className='Login-form' onSubmit={handleSubmit}>
        <input type='text' name='username' placeholder='Github Username'/>
        <button>Sign in to Github</button>
      </form>
    )
  }
}

export default Login;