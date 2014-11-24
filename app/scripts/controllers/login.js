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
        $scope.pages = [];
        var offset = 0,
            allPages = false;
        $scope.login = function () {
            $facebook.login().then(function(response) {
                $scope.loggedIn = true;
                $scope.getPages();
            });
        };

        $scope.chosePages = function () {
            fbService.setPages(chosenPages);
            $location.path('main');
        };

        $scope.getPages = function () {
            fbService.getUserPages(offset).then(
                function (response) {
                    $scope.pages = $scope.pages.concat(response.data);
                    if (response.data.length !== 100) {
                        allPages = true;
                    } else {
                        offset = offset + 100;
                    }
                }
            );
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
