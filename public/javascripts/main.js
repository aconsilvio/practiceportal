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
  $scope.numVideos = 10;
  $scope.isLoggedIn = false;
  var groupIDs = ["687498148076618", "222774521466864", "1517819058276334", "158881161246610", "1144863825582537", "1137083516407421", "363584057367097", "353600324976899", "1230747207018937", "224802994614669", "1435519730079849", "760242687459625", "1032810963489791", "1627655720873882", "1631363607173492", "205198266611379", "661301877370767", "1115432718579904"]
  $scope.groupInstruments = ["voice", "tuba", "sax", "oboe", "trombome", "bassoon", "clarinet", "guitar", "piano", "flute", "viola", "cello", "bass", "precussion", "trumpet", "french horn", "violin", "sister"]
  function toObject(names, values) {
    var result = {};
    for (var i = 0; i < names.length; i++)
         result[names[i]] = values[i];
    return result;
  }
  
  var idDict = toObject(groupIDs, $scope.groupInstruments);
  var nameDict = toObject($scope.groupInstruments, groupIDs);
  
  function getVideos(groupID){
    $facebook.api("/"+ groupID + "/videos").then( 
      function(response) {
        $scope.feedRaw = response;
        for (var i = 0; i < $scope.feedRaw.data.length; i++){
          $facebook.api("/"+ $scope.feedRaw.data[i].id +"?fields=comments{from,attachment,id,message,created_time},from,description,updated_time,embed_html,length,picture,title").then(
            function(res){
              res.instrument = idDict[groupID]
              res.realtime = new Date(res.updated_time)
              res.updated_time = new Date(res.updated_time).getTime()
              feed.push(res);
            })
        }
      },
      function(err) {
        $scope.welcomeMsg = "Please log in";
      });
  }

  function refresh() {
    for(var key in idDict){
      getVideos(key)
    }

    $scope.videoFeed = feed;

  }

  $scope.getAllVideos = function(){
    $scope.numVideos = 10
    feed = [];
    refresh()
  }

  $scope.setInstrument = function(instrument){
    $scope.numVideos = 10
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

  
  $http.get("/")
    .success(function(data){
      refresh();
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
