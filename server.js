const express = require('express'),
      server = express(),
      resolve = require('path').resolve,
      morgan = require('morgan'),
      axios = require('axios'),
      bodyParser = require('body-parser'),
      session = require('client-sessions');

const { client_id, client_secret } = require('./client/src/.env');

const Octokit = require('@octokit/rest');
      
      
server.use([
  express.static(resolve(__dirname)),
  morgan('dev'),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  session({
    cookieName: 'session',
    secret: 'mysecret',
    duration: 30 * 60* 1000,
    activeDuration: 5 * 60 * 1000
  })
]);

server.get('/', (req, res) => res.sendFile(resolve(__dirname, 'client', 'public', 'index.html')));

server.get('/user/signin/callback', (req, res, next) => {
  const { query } = req;
  const { code } = query;
  
  if(code){
    axios.post('https://github.com/login/oauth/access_token', { 
      code,
      client_id, 
      client_secret
    }, {
      headers: {'Accept': 'application/json'}
    })
    .then(res => res.data)
    .then(accessObj => {
      req.session.token = accessObj.access_token;
      res.redirect('back');
    })
    .catch(next);
  } else {
    res.sendStatus(500);
  }
});

server.get('/test', (req, res, next) => {
  console.log('Token =', req.session.token);
  octokit = new Octokit();
  octokit.authenticate({
    type: 'oauth',
    token: req.session.token
  });
  octokit.activity.listEventsForUser({username:'mrkit'})
  .then(data => { console.log(data); res.send(data)})
  .catch(next);
  
  
  if(req.session && req.session.token){
    console.log('Success, token =', req.session.token);
  } else {
    console.log('You\'re not logged in')
  }
  
/*
  res.json({ data: [
    { actor: { display_login: 'Latesha' },
      repo: { name: 'Beats a cat' },
      payload: { commits: [{id: 1, message: 'This is a bright day'}]} },
    { actor: { display_login: 'Sebastien' },
      repo: { name: 'Help a cat' },
      payload: { commits: [{id: 1, message: 'This is a boring day'}]} },
    { actor: { display_login: 'John' },
      repo: { name: 'Treat a cat' },
      payload: { commits: [{id: 1, message: 'Hello do you smoke'}]} },
   { actor: { display_login: 'Bryan' },
      repo: { name: 'Skate a cat' },
      payload: { commits: [{id: 1, message: 'Children it\'s time'}]} }  
  ]})
//  */
});

server.use((err, req, res, next) => {
  if(err) console.log(err.message);
});

server.listen(3001, console.log('listening on 3000 but this server is 3001'));