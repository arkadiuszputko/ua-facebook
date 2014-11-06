'use strict';

/**
 * @ngdoc function
 * @name uaFacebookApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uaFacebookApp
 */
angular.module('uaFacebookApp')
  .controller('MenuCtrl', function ($scope, $sce, $facebook, fbService) {
  	$scope.pages = fbService.getDefinedPages()
  });
