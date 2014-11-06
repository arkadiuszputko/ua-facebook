'use strict';

/**
 * @ngdoc function
 * @name uaFacebookApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uaFacebookApp
 */
angular.module('uaFacebookApp')
  .controller('MainCtrl', function ($scope, $sce, $facebook, fbService) {
    $scope.isLoggedIn = false;
    $scope.login = function () {
        $facebook.login().then(function(response) {
            getData();
        });
    };

    var getData = function () {
        fbService.getLatest().then(
            function (response) {
                $scope.latest = response;
                $scope.isLoggedIn = true;
                console.log($scope.latest); 
            },
            function (err) {
                console.log(err);
            }
        );
    }

    $scope.getClass = function (item) {
        return item.news.cssClass.join(' ');
    };


    getData();

  });
