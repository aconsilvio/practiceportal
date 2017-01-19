angular.module('practicePortal', ['ngFacebook'])

.config( function( $facebookProvider ) {
  $facebookProvider.setAppId('1875721405997329');
})

.run( function( $rootScope ) {
  // Load the facebook SDK asynchronously
  (function(){
     // If we've already installed the SDK, we're done
     if (document.getElementById('facebook-jssdk')) {return;}

     // Get the first script element, which we'll use to find the parent node
     var firstScriptElement = document.getElementsByTagName('script')[0];

     // Create a new script element and set its id
     var facebookJS = document.createElement('script'); 
     facebookJS.id = 'facebook-jssdk';

     // Set the new script's source to the source of the Facebook JS SDK
     facebookJS.src = '//connect.facebook.net/en_US/all.js';

     // Insert the Facebook JS SDK into the DOM
     firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
   }());
});

var DemoCtrl = function ($scope, $facebook, $http, $window) {
  var feed = [];
  var numVideos = 12;
  $scope.numVideos = numVideos;
  $scope.isLoggedIn = false;
  $scope.navInstrument = "instruments";
  $scope.showLiveLinks = false;
  $scope.mainVideo = {}
  // var groupIDs = ["158881161246610"]
  // $scope.groupInstruments = ["oboe"]
  $scope.groupIDs = [ 
  "224802994614669", 
  "158881161246610", 
  "363584057367097", 
  "1137083516407421", 
  "1517819058276334", 
  "205198266611379", 
  "1627655720873882", 
  "222774521466864", 
  "1032810963489791", 
  "1631363607173492", 
  "661301877370767",
  "1230747207018937",
  "1435519730079849", 
  "760242687459625", 
  "353600324976899", 
  "1144863825582537", 
  "687498148076618"]
  $scope.groupInstruments = [ 
  "flute", 
  "oboe", 
  "clarinet",
  "bassoon",  
  "saxophone",
  "french horn",  
  "trumpet", 
  "trombone", 
  "tuba", 
  "percussion",
  "violin",
  "viola", 
  "cello",  
  "double bass",
  "guitar", 
  "piano",  
  "voice"]
  function toObject(names, values) {
    var result = {};
    for (var i = 0; i < names.length; i++)
         result[names[i]] = values[i];
    return result;
  }
  
  var idDict = toObject($scope.groupIDs, $scope.groupInstruments);
  var nameDict = toObject($scope.groupInstruments, $scope.groupIDs);
  
  function getVideos(groupID){
    var currentTime = new Date().getTime();
    $facebook.api("/"+ groupID + "/videos").then( 
      function(response) {
        $scope.feedRaw = response;
        for (var i = 0; i < $scope.feedRaw.data.length; i++){
          $facebook.api("/"+ $scope.feedRaw.data[i].id +"?fields=comments{from,attachment,id,message,created_time},from,description,updated_time,permalink_url,length,picture,title").then(
            function(res){
              res.instrument = idDict[groupID]
              res.realtime = res.updated_time;
              var a = res.updated_time.split(/[^0-9]/);
              res.updated_time = new Date (a[0],a[1]-1,a[2],a[3],a[4],a[5]);
              console.log(res.updated_time);

              res.length = (res.length/60).toFixed(2).toString().replace(".", ":");
              // time difference in ms
              var timeDiff = currentTime - res.updated_time;
              // strip the ms
              timeDiff /= 1000;

              // get seconds (Original had 'round' which incorrectly counts 0:28, 0:29, 1:30 ... 1:59, 1:0)
              var seconds = Math.round(timeDiff % 60);

              // remove seconds from the date
              timeDiff = Math.floor(timeDiff / 60);

              // get minutes
              var minutes = Math.round(timeDiff % 60);

              // remove minutes from the date
              timeDiff = Math.floor(timeDiff / 60);

              // get hours
              var hours = Math.round(timeDiff % 24);

              // remove hours from the date
              timeDiff = Math.floor(timeDiff / 24);

              // the rest of timeDiff is number of days
              var days = timeDiff ;

              if(days != 0){  //if more than 0 days have passed
                if(days == 1){
                  res.timeSince = days + " day ago"
                } else {
                res.timeSince = days + " days ago";
                }
              } else if(hours != 0){ //if more than 0 hours have passed
                if(hours ==1){
                  res.timeSince = hours + " hour ago"
                } else{
                res.timeSince = hours + " hours ago"
                }
              } else if(minutes != 0){
                if(minutes ==1){
                  res.timeSince = minutes + " minute ago"
                }
                res.timeSince = minutes + " minutes ago"
              } else{
                res.timeSince = seconds + " seconds ago"
             }
              feed.push(res);
            })
        }
      },
      function(err) {
        $scope.welcomeMsg = "Please log in";
      });
  }

  function refresh() {
    clearOneVideo();
    for(var key in idDict){
      getVideos(key)
    }
    setVideos()
  }

  function setVideos(){
    $scope.videoFeed = feed

  }

  function clearOneVideo(){
    $scope.mainVideo = {};
    $scope.oneVideo = false
  }

  $scope.getAllVideos = function(){
    clearOneVideo();
    $scope.searchText = "";
    $scope.showLiveLinks = false;
    $scope.navInstrument = "instruments"
    $scope.numVideos = numVideos;
    feed = [];
    refresh()
  }

  $scope.setInstrument = function(instrument){
    clearOneVideo();
    $scope.searchText = "";
    $scope.showLiveLinks = false;
    $scope.show = false;
    $scope.numVideos = numVideos;
    $scope.navInstrument = instrument;
    $scope.currentInstrument = instrument;
    feed = [];
    getVideos(nameDict[instrument])
    $scope.videoFeed = feed;
  }

  $scope.login = function(){
    $facebook.login().then(function(response){
      $scope.isLoggedIn = true;
      refresh();
    })
  }

  $scope.logout = function(){
    $facebook.logout().then(function(res){
      $scope.isLoggedIn = false;
    })
  }

  $scope.viewFull = function(videoID, instrument){
    $scope.oneVideo = true;
    $scope.navInstrument = instrument;
    $scope.showLiveLinks = false;
    $scope.searchText = "";
    $facebook.api("/"+ videoID +"?fields=comments{from,attachment,id,message,created_time,live_broadcast_timestamp},from,description,updated_time,permalink_url,length,picture,title").then(
            function(res){
              res.instrument = instrument;
              if(res.comments != undefined){
                $scope.comments = true;
                for(comment in res.comments.data){
                  res.comments.data[comment].showTime = (res.comments.data[comment].live_broadcast_timestamp/60).toFixed(2).toString().replace(".", ":");
                  if (res.comments.data[comment].showTime == 'NaN'){
                    res.comments.data[comment].showTime = '0:00';
                    res.comments.data[comment].live_broadcast_timestamp = 0;
                  }
                  // res.comments.data[comment].live_broadcast_timestamp = live_broadcast_timestamp/60;
                }
              } else{
                $scope.comments = false;
              }
              res.realtime = new Date(res.updated_time);
              res.updated_time = new Date(res.updated_time).getTime();
              $scope.mainVideo = res;
            })
  }
  
  $http.get("/")
    .success(function(data){
    })
    .error(function(data){
      console.log("err")
    })

  // $http.get("/")
  // .success(function(data){

  // })
  // .error(function(data){
  //   console.log("err")
  // })

};
