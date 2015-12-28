// Schema definition is done here 
var mongoose= require('mongoose');
var Schema = mongoose.Schema;

var userSchema=new Schema({
	username:{
		type:String
	},
    password:String,
    google:{
    	id:String,
    	email:String,
        displayName:String
    },
    facebook:{
    	id:String,
    	email:String,
       displayName:String
    },
    twitter:{
    	id:String,
    	email:String,
       displayName:String
    },
    votedFor:[String]

    
});

module.exports=mongoose.model('users',userSchema);