'use strict';

/**
 * @ngdoc function
 * @name uaFacebookApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the uaFacebookApp
 */
angular.module('uaFacebookApp')
  .controller('LoginCtrl', function ($scope, $sce, $facebook, $location, fbService) {
    $scope.loggedIn = false;
    $scope.chosenPages = [];
    $scope.login = function () {
        $facebook.login().then(function(response) {
            $scope.loggedIn = true;
            $facebook.api('/me/likes?limit=150', {fields: 'id, name, category, picture, cover'}).then(
                function (response) {
                    console.log(response);
                    $scope.pages = response.data;
                }
            );
        });
    };

    $scope.chosePages = function () {
        fbService.setPages(chosenPages);
        $location.path('main');
    };

    $scope.pushToChosen = function (item) {
        item.wanted = !item.wanted;
        if (item.wanted) {
            $scope.chosenPages.push(item);
        }
    };
  });
