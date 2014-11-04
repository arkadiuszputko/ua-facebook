'use strict';

/**
 * @ngdoc function
 * @name uaFacebookApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uaFacebookApp
 */
angular.module('uaFacebookApp')
  .controller('MainCtrl', function ($scope, $sce, fbService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    fbService.getLatest().then(
    	function (response) {
    		$scope.latest = response;
    	},
    	function (err) {
    		console.log(err);
    	}
    );

    $scope.getMessage = function (i) {
    	var msg = '';
    	if ($scope.latest[i].news.message.length) {
    		msg = $scope.latest[i].news.message;
    	} else if (!$scope.latest[i].news.message.length && $scope.latest[i].news.attachment.description) {
    		msg = $scope.latest[i].news.attachment.description;
    	} else {
    		msg = $scope.latest[i].news.attachment.caption;
    	}
    	return msg;
    };

    $scope.getImage = function (i) {
    	return $sce.trustAsHtml($scope.latest[i].news.attachment.media[0].src);
    }

  });
