var express = require('express'); 
var router = express.Router(); 
var mongoose = require('mongoose'); 
var path = require('path'); 
var Video = require(path.join(__dirname,'../models/videoModel'));


video = {}; 

//This function only needs to be called one time to set up the

// video.createDB = function(req, res){
// 	var currentFeed = req.body.content;
// 	console.log(currentFeed)

// 	for(var video in currentFeed){
// 		console.log(currentFeed)
		// Video.create({
		// 	facebookID:currentFeed[video].id, 
		// 	instrument: currentFeed[video].instrument, 
		// 	description: currentFeed[video].description, 
		// 	time: currentFeed[video].updated_time
		// }), function(err, new1){
		// 	if(err) return res.status(500);
		// 	res.json({new1:new1})
		// }
// 	}

// }

video.getAllVideos = function(req, res){
	Video.find({}, function(err, videos){
		res.json(videos);
	})
}

video.getNewVideos = function(req, res){
	var videoNew = req.body.content;
	Video.find({facebookID:videoNew.id}, function(err, videoObj){
		if(err) res.sendStatus(500)
		if(videoObj.length == 0){
			Video.create({
					facebookID:videoNew.id, 
					instrument: videoNew.instrument, 
					description: videoNew.description, 
					time: videoNew.updated_time
				}), function(err, new1){
					if(err) return res.status(500);
					console.log(new1, "new vid")
					Video.find({}, function(err, allVids){
						res.json(allVids)
					})
				}
			} else {
				Video.find({}, function(err, allVids){
						res.json(allVids)
					})
			}	
	})
}

	
	// for(var video in videoFeed){
	// 	console.log(videoFeed[video].id, "undef?")
	// 	Video.find({facebookID:videoFeed[video].id}, function(err, videoNew){
	// 		if(err) res.sendStatus(500);
	// 		console.log(videoNew, "videoNew")
	// 		if(video == null){
	// 			Video.create({
	// 				facebookID:videoFeed[video].id, 
	// 				instrument: videoFeed[video].instrument, 
	// 				description: videoFeed[video].description, 
	// 				time: videoFeed[video].updated_time
	// 			}), function(err, new1){
	// 				if(err) return res.status(500);
	// 			}
	// 		}
	// 	})
	// }



module.exports = video;