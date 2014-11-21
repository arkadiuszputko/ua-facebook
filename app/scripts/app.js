'use strict';

/**
 * @ngdoc overview
 * @name uaFacebookApp
 * @description
 * # uaFacebookApp
 *
 * Main module of the application.
 */
angular
  .module('uaFacebookApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngFacebook',
    'ngMaterial',
    'angular.filter',
    'iso.directives',
    'wu.masonry',
    'ui.bootstrap',
    'youtube-embed',
    'uaFacebookApp.fbService'
  ])
  .config( function( $facebookProvider ) {
    $facebookProvider.setAppId('140055362726064');
    $facebookProvider.setPermissions("email,user_likes,read_stream");
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/about/:id', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function ($rootScope){
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
