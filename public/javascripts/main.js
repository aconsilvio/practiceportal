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

var DemoCtrl = function ($scope, $facebook, $http) {
  var feed = [];
  var groupIDs = ["687498148076618", "222774521466864", "1517819058276334", "158881161246610", "1144863825582537", "1137083516407421", "363584057367097", "353600324976899", "1230747207018937", "224802994614669", "1435519730079849", "760242687459625", "1032810963489791", "1627655720873882", "1631363607173492", "205198266611379", "661301877370767", "1115432718579904"]
  var groupInstruments = ["voice", "tuba", "sax", "oboe", "trombome", "bassoon", "clarinet", "guitar", "piano", "flute", "viola", "cello", "bass", "precussion", "trumpet", "french horn", "violin", "sister"]
  
  function toObject(names, values) {
    var result = {};
    for (var i = 0; i < names.length; i++)
         result[names[i]] = values[i];
    return result;
  }
  
  var idDict = toObject(groupIDs, groupInstruments)
  
  function getNewVideos(groupID){
    $facebook.api("/"+ groupID + "/videos").then( 
      function(response) {
        $scope.feedRaw = response;
        for (var i = 0; i < $scope.feedRaw.data.length; i++){
          $facebook.api("/"+ $scope.feedRaw.data[i].id).then(
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
      getNewVideos(key)
    }

    $scope.newFeed = feed;

  }

  $scope.createDB = function (){
    refresh()
    $http.post("/createDB", {content: $scope.newFeed})
      .success(function(data){
        console.log(data)
        console.log("database added")
      })
      .error(function(data){
        console.log("fails")
      })
  }




  $http.get("/")
    .success(function(data){
      $http.get("/getAllVideos")
        .success(function(data){
          $scope.feed = data;
          refresh();
        })
        .error(function(data){
          console.log("error")
        })

    })
    .error(function(data){
      console.log("err")
    })

  $scope.getNewFunc = function(){
    console.log("clicked")
      $http.post("/getNewVideos", {content: $scope.newFeed})
          .success(function(data1){
            console.log("new videos added")
            $scope.feed = data1;
            // $http.get("/getAllVideos")
            //   .success(function(data){
            //     $scope.feed = data;
            //     refresh();
            //   })
            //   .error(function(data){
            //     console.log("error")
            //   })
          })
          .error(function(data1){
            console.log("err");
          })
      
    }

};


  // function refresh() {
  //   $facebook.api("/me").then( 
  //     function(response) {
  //       $scope.welcomeMsg = "Welcome " + response.name;
  //     },
  //     function(err) {
  //       $scope.welcomeMsg = "Please log in";
  //     });
  // }
//};

// var pp = angular.module('ngApp', ['facebook'])
//   .config(function(FacebookProvider) {
//      // Set your appId through the setAppId method or
//      // use the shortcut in the initialize method directly.
//      FacebookProvider.init('1875721405997329');
//   });

// function mainController($scope, $http, Facebook) {
//   // $window.fbAsyncInit = function() {
//   //   FB.init({ 
//   //     appId: '1875721405997329',
//   //     status: true, 
//   //     cookie: true, 
//   //     xfbml: true,
//   //     version: 'v2.4'
//   //   });

//   $http.get('/')
//     .success(function(data){
//       console.log("here")
//       $scope.group = function(){
//        Facebook.api(
//           "/191813164601019",
//           function (response) {
//             if (response && !response.error) {
//               /* handle the result */
//               console.log(response);
//               console.log("hello");
//               $scope.groupRes = response;
//             }
//           }
//       )}
      
//      })
//     .error(function(data){
//       console.log('Error:' + data);
//     });

// };


//   // //load front page with database information
//   // $http.get('api/home')
//   //   .success(function(data){
//   //     $scope.wiki = data;
//   //   })
//   //   .error(function(data){
//   //     console.log('Error:' + data);
//   //   });


//   // $scope.selectWiki = function(header){
//   // //loads content and header for a specific database entry based on link

//   //   //hides the new wiki form & resets the current entry into newWiki
//   //   $scope.showNewWiki = false; 
//   //   $scope.showEdit = true;
//   //   $scope.newWiki = {};

//   //   //get request to database to get object specified by header
//   //   $http.get('api/header/'+header)
//   //     .success(function(data){
//   //       //enters object data into index.html mainWiki content
//   //       $scope.mainWiki = data;
//   //       $scope.header = $scope.mainWiki.header;
//   //       $scope.content = $scope.mainWiki.content;

//   //       //sets content editor to false
//   //       $scope.editorEnabled = false;
//   //     })
//   //     .error(function(data){
//   //       console.log('Error:' + data);
//   //     });
//   // };

//   // $scope.saveNewWiki = function(){ 
//   // //saves new wiki to database
//   //   //hides new wiki form
//   //   $scope.showNewWiki = false;

//   //   //posts new wiki content to database
//   //   $http.post('/api/createNew', {header: $scope.newWiki.header, content: $scope.newWiki.content})
//   //     .success(function(data){ 
//   //       $scope.newWiki = data.newWiki;
//   //       $scope.wiki = data.all;
//   //     })
//   //     .error(function(data){ 
//   //       console.log("Failure", data)
//   //     })

//   // }
  
//   // //shows new wiki form
//   // $scope.enableShowNewWiki = function(){ 
//   //   $scope.showNewWiki = true; 
//   // }

//   // //shows editor for main wiki header & content
//   // $scope.enableEditor = function() {
//   //   $scope.editorEnabled = true;
//   //   $scope.editableHeader = $scope.mainWiki.header;
//   //   $scope.editableContent = $scope.mainWiki.content;
//   // };
  
//   // //hides main wiki header & content editor
//   // $scope.disableEditor = function() {
//   //   $scope.editorEnabled = false;
//   // };
   
//   // //save edited wiki to database    
//   // $scope.save = function(header) {
//   //   //hides new wiki form
//   //   $scope.showNewWiki = false; 

//   //   //sets main wiki content to content in edit form
//   //   $scope.mainWiki.content = $scope.editableContent;
//   //   $scope.mainWiki.header = $scope.editableHeader;

//   //   //disables main wiki editor
//   //   $scope.disableEditor();

//   //   //posts new content to database
//   //   $http.post('/api/header/' + header, {header: $scope.mainWiki.header, content:$scope.mainWiki.content})
//   //     .success(function(data){
//   //       $scope.wiki = data.all;
//   //     })
//   //     .error(function(data){
//   //     console.log('Error:' + data);
//   //   });
//   // };

//   // $scope.search = function(){
//   //   //searched database for a specific query in search form
//   //   $scope.searchQuery = angular.copy($scope.query)
//   //   $scope.selectWiki($scope.searchQuery);
//   // }

