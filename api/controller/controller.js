var userQueries = require('../model/userQueries.js');
var pollQueries = require('../model/pollQueries.js');
var util = require('../util/util.js');
var Promise = require('bluebird');

exports.login = function(req, res, next) {
    res.render('login');
};

// check which polls are applicable 
exports.userPage = function(req, res, next) {
Promise.all([pollQueries.getAllPolls(),userQueries.findUser(req.user.username)]).spread(function(polls,userdata){
  var votedfor=userdata.toObject().votedFor;
  if(!polls){
    res.render('user', {
                message: 'no polls at the moment please come later...',
                results: votedfor,
                user: req.user.username,
            });
  }
  else{
         var months = [];
         var results=[];
            polls.forEach(function(data) {
              if(votedfor.indexOf(data.month)===-1){
                months.push(data.month);
              }
            });
        console.log('user has already voted for ->',votedfor);
        console.log('months ->',months);

          res.render('user', {
                polls: months,
                results: votedfor,
                user: req.user.username,
            });

  }
  
}).catch(function(err){
   console.log(err);
});





};


exports.poll = function(req, res, next) {
    var month = req.query.month;
    res.render('poll', {
        month: month
    });
};


exports.results = function(req, res, next) {
    var month = req.query.month;
    pollQueries.getPollForMonth(month).
    then(function(data) {
        if (!data) {
            console.log("error mshg here");
        } else {
            var result = [];
            result = data.toObject().details;
            result.sort(util.descendingSort);
            res.render('results', {
                results: result
            });
        }
    }).
    catch(function(err) {
        console.log(err);
    });
};

exports.casteVote = function(req, res, next) {
    var venue = req.body.venue;
    var date = req.body.date;
    var user = req.user.username;
    var month = req.body.month;
    Promise.all([pollQueries.getPollForMonth(month), userQueries.findUser(user)])
        .spread(function(pollMonth, userdata) {
            console.log("month data - ", pollMonth);
            console.log("user data - ", userdata);
            if (!pollMonth) {
                req.flash('error', 'poll for the month is not avilable at the moment');
                throw new Error("poll for the month is not avilable at the moment");

            } else {
                Promise.all([pollQueries.updateOrAdd(pollMonth, venue, date, user), userQueries.updateUserPoll(userdata, month)])
                    .then(function() {
                        req.flash('success', 'poll for the month has been cast');
                        res.redirect('/user');
                    });

            }

        }).catch(function(err) {
            console.log(err);
            res.redirect('/user');
        });



};
