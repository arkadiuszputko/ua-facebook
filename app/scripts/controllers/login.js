'use strict';

/**
 * @ngdoc function
 * @name uaFacebookApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the uaFacebookApp
 */
angular.module('uaFacebookApp')
    .controller('LoginCtrl', function ($scope, $rootScope, $sce, $facebook, $location, fbService) {
        $scope.loggedIn = false;
        $scope.chosenPages = [];
        $scope.login = function () {
            $facebook.login().then(function(response) {
                $scope.loggedIn = true;
                $facebook.api('/me/likes?limit=150', {fields: 'id, name, category, picture, cover'}).then(
                    function (response) {
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
            } else {
                angular.forEach($scope.chosenPages, function (page) {
                    if (page.id === item.id) {
                        $scope.chosenPages.splice($scope.chosenPages.indexOf(item), 1);
                    }
                });
            }
            $rootScope.$broadcast('masonry.reload');
        };

        $scope.getClass = function (category) {
            var count = 0,
                className = 'single';
            angular.forEach($scope.chosenPages, function (page) {
                if (category === page.category) {
                    count++
                }
            });
            switch (count) {
                case 1:
                    className = 'single'
                    break;
                case 2:
                    className = 'double'
                    break;
                case 3:
                    className = 'triple'
                    break;
                case 4:
                    className = 'quadriple'
                    break;
                default:
                    className = 'penta';
                    break;
            };

            return className;
        };

        $scope.login();
    });
