var mongoose = require('mongoose'); 

var videoSchema = mongoose.Schema({ 
	facebookID: String, 
	instrument: String,
	description: String,
	time: String
}); 

var content = mongoose.model('content',  videoSchema);
module.exports = content;