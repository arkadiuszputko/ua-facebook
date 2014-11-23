'use strict';

/**
 * @ngdoc function
 * @name uaFacebookApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the uaFacebookApp
 */
angular.module('uaFacebookApp')
  .controller('AboutCtrl', function ($scope, $routeParams, $sce, fbService) {
    fbService.getPageById($routeParams.id).then(
    	function (response) {
            $scope.page = response;
    		console.log(response);
    	},
    	function () {

    	}
    );

    $scope.getClass = function (item) {
        return item.cssClass.join(' ');
    };

    $scope.getCoverPhoto = function (item) {
        item.full = false;
        return 'https://graph.facebook.com/' + item.cover_photo + '/picture?type=normal';
    };

    $scope.toggle = function (item) {
        item.full = !item.full;
    };
  });
