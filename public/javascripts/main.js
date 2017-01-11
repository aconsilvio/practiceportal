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
})

;

var DemoCtrl = function ($scope, $facebook) {
  $scope.isLoggedIn = false;
  $scope.login = function() {
    $facebook.login().then(function() {
      refresh();
    });
  }
  function refresh() {
    $facebook.api("/me").then( 
      function(response) {
        $scope.welcomeMsg = "Welcome " + response.name;
        $scope.isLoggedIn = true;
      },
      function(err) {
        $scope.welcomeMsg = "Please log in";
      });
  }
  
  refresh();
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

