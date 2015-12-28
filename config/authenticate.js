var localStrategy = require('passport-local').Strategy;
var googleStrategy = require('passport-google-oauth').OAuth2Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var twitterStrategy = require('passport-twitter').Strategy;
var Promise = require('bluebird');
var user = require('../api/model/userQueries.js');


module.exports = function(passport, config) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });


    passport.use(new localStrategy(function(username, password, done) {
        user.authenticateUser(username, password).
        then(function(user) {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: 'username or password is incorrect'
                });
            }
        }).catch(function(err) {
            return done(err, false, {
                message: 'username or password is incorrect'
            })
        });
    }));

    passport.use(new googleStrategy({
        scope: config.google.scope,
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
    }, function(accessToken, refreshToken, profile, done) {
        console.log("--->>>> ", profile);
        user.findOrAddUser(profile).
        then(function(user) {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: 'Oops something went wrong , please try after sometime.'
                });
            }
        }).catch(function(err) {
            return done(err, false, {
                message: 'Oops something went wrong , please try after sometime.'
            });
        });
    }));


    passport.use(new facebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL
    }, function(accessToken, refreshToken, profile, done) {

        user.findOrAddUser(profile).
        then(function(user) {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: 'Oops something went wrong , please try after sometime.'
                });
            }
        }).catch(function(err) {
            return done(err, false, {
                message: 'Oops something went wrong , please try after sometime.'
            })
        });
    }));

    passport.use(new twitterStrategy({
        consumerKey: config.twitter.clientID,
        consumerSecret: config.twitter.clientSecret,
        callbackURL: config.twitter.callbackURL,
    }, function(accessToken, refreshToken, profile, done) {
        user.findOrAddUser(profile).
        then(function(user) {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: 'Oops something went wrong , please try after sometime.'
                });
            }
        }).catch(function(err) {
            return done(err, false, {
                message: 'Oops something went wrong , please try after sometime.'
            })
        });
    }));
};
