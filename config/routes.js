var controller = require('../api/controller/controller.js');
var authenticate = require('./authenticate.js');

module.exports = function(app, passport) {

    //loginpage
    app.get('/', controller.login);

    //user page
    app.get('/user', controller.userPage);

    // voting page
    app.get('/poll',controller.poll); 
    
    // results page
    app.get('/results',controller.results);

    // vote submit
    app.post('/vote',controller.casteVote);

    // local authentication
    app.post('/login', passport.authenticate('local', {
        successRedirect: '/user',
        failureRedirect: '/',
        failureFlash: true
    }));

    // google Oauth 
    app.get('/login/google', passport.authenticate('google'));
    app.get('/login/google/return', passport.authenticate('google', {
        successRedirect: '/user',
        failureRedirect: '/',
        failureFlash: true
    }));

    // facebook Oauth
    app.get('/login/facebook', passport.authenticate('facebook'));
    app.get('/login/facebook/return', passport.authenticate('facebook', {
        successRedirect: '/user',
        failureRedirect: '/',
        failureFlash: true
    }));

    // twitter Oauth
    app.get('/login/twitter', passport.authenticate('twitter'));
    app.get('/login/twitter/return', passport.authenticate('twitter', {
        successRedirect: '/user',
        failureRedirect: '/',
        failureFlash: true
    }));

};
