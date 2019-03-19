import React, { Component } from 'react';
import Login from './Login';
import './App.css';

class App extends Component {
  state = { 
    users: [],
    loggedIn: false
  }
  
  componentDidMount(){
    fetch('/test')
    .then(res => res.json())
    .then(users => this.setState({ users: users.data }))
    .catch(err => console.log(err.message));
  }

  render() {
    const { users, loggedIn } = this.state;

    return (
      <div className='App'>
       <header className='App-header'>
         <h1 className='App-header-h1'>Github</h1>
         { loggedIn ? <button>Logout</button> : <Login/>}
       </header>

       <main className='App-users'>
        {
          users.map(user => <div className='App-users-items' key={user.id}>
            <h4 className='App-users-items-display-name'>Display Name: {user.actor.display_login}</h4>
            <h5 className='App-users-items-repo'>Repo Name: {user.repo.name}</h5>
            Commits: 
              <ul className='App-users-items-ul'> 
               {
                user.payload.commits ? 
                user.payload.commits.map(commit => <li className='App-users-items-ul-li' key={commit.id}>{commit.message}</li>) : 
                'No commits'
               }
              </ul>
          </div>)
        }
        </main>
      </div>
    );
  }
}

export default App;
