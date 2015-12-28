var User = require('./user.js');
var Promise = require('bluebird');
var bcrypt = require('bcrypt-nodejs');
var compare = Promise.promisify(bcrypt.compare);

exports.findUser = function(username) {
    return User.findOne({
        username: username
    }).exec();
};


exports.authenticateUser = function(username, password) {
    return new Promise(function(resolve, reject) {
        User.findOne({
            username: username
        }).exec().
        then(function(user) {
                if (user) {
                    compare(password, user.password).then(function(result) {
                        if (result === true) {
                            resolve(user);
                        } else {
                            reject('invalid pasword');
                        }
                    });

                } else {
                    reject('user is not found');
                }
            })
            .catch(function(err) {
                reject(err);
            });
    });
};

exports.findOrAddUser = function(profile) {
    return new Promise(function(resolve, reject) {
        console.log('inside');
        var provider = profile.provider;
        var query = {};
        query[provider + '.id'] = profile.id;
        User.findOne(query).exec().
        then(function(user) {
            if (user) {
                console.log('already exists');
                resolve(user);
            } else {
                newUser = {};
                var name;
                if(prfile.displayName===""){
                name=profile.emails[0].value.split("@");
                newUser['username']=name[0];
                }
                else{
                   newUser['username']=prfile.displayName; 
                }
                newUser['' + provider] = {};
                newUser['' + provider].id = profile.id;
                newUser['' + provider].email = profile.emails[0].value;
                newUser['' + provider].displayName = profile.displayName;
                User.create(newUser).then(function(user1) {
                    resolve(user1);
                });


            }
        }).catch(function(err) {
            reject(err);
        });
    });

};

exports.updateUserPoll = function(user, month) {
    console.log(user);
    var polls = user.toObject().votedFor;
    polls.push(month);
    console.log(polls);
    return User.update({username:user.username},{$set:{votedFor:polls}}).exec();
};