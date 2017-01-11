var mongoose = require('mongoose'); 

var contentSchema = mongoose.Schema({ 
	facebookID: String, 
	type: String
}, {'collection' : 'content'}); 

var content = mongoose.model('content',  contentSchema);
module.exports = content;