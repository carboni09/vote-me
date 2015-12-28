var poll = require('./poll.js');
var Promise = require('bluebird');

exports.getAllPolls=function() {
	return poll.find().exec();
};

exports.getPollForMonth=function(month){
return poll.findOne({month:month}).exec();
};

exports.updateOrAdd=function(data,venue,date,user){
      var details=data.toObject().details;
      console.log("details here ",details);
      var venueExists=details.map((d)=>{return d['venue']}).indexOf(venue);
      var dateExists=details.map((d)=>{return d['date']}).indexOf(date);
      if(venueExists>-1 && dateExists>-1){
      	// update in the same json in details array
        details[venueExists].users.push(user);
        return  poll.update({month:data.month},{$set:{details:details}}).exec();
      }
      else{
      	// add new entry in details array
      	var newDoc={};
      	newDoc['venue']=venue;
      	newDoc['date']=date;
      	var users=[];
        users.push(user);
      	newDoc['users']=users;
        details.push(newDoc);
        return poll.update({month:data.month},{$set:{details:details}}).exec();
      }
};