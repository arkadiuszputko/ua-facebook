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
        $scope.chosenCategories = [];
        $scope.pages = [];
        $scope.dragMode = 'clone';

        var offset = 0,
            allPages = false,
            draggingPage = null;

        $scope.dropped = function (ev, obj, cat) {
            if (draggingPage) {
                addToCategory(cat, draggingPage);
                if ($scope.dragMode === 'move') {
                    removeFromChosenCategories(draggingPage, cat);
                }
                if ($scope.dragMode === 'clone') {
                    draggingPage.clones = draggingPage.clones ? draggingPage.clones++ : 0;
                }
            }
        };

        $scope.dragStart = function (ev, obj, item) {
            draggingPage = item;
        };

        $scope.dragStop = function () {
            draggingPage = null;
        }

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
                    if (response.paging.next) {
                        getNextPages(response.paging.next);
                    }
                }
            );
        };

        var getNextPages = function (url) {
            $facebook.api(url).then(
                function (response) {
                    $scope.pages = $scope.pages.concat(response.data);
                    if (response.paging.next) {
                        getNextPages(response.paging.next);
                    }
                }
            );
        };

        var addToChosenCategories = function (item) {
            var pushed = false;
            angular.forEach($scope.chosenCategories, function (cat) {
                if (cat.name === item.category) {
                    cat.pages.push(item);
                    cat.className = getClass(cat);
                    pushed = true;
                }
            });
            if (!pushed) {
                $scope.chosenCategories.push({
                    name: item.category,
                    pages: [item],
                    className: 'single'
                });
            }
            pushed = false;
        };

        var addToCategory = function (cat, item) {
            cat.pages.push(item);
            cat.className = getClass(cat);
        };

        var removeFromChosenCategories = function (item, cat) {
            angular.forEach($scope.chosenCategories, function (c) {
                if (c.name === item.category) {
                    angular.forEach(c.pages, function (page) {
                        if (page.id === item.id) {
                            c.pages.splice(c.pages.indexOf(item), 1);
                        }
                        if (page.clones === 0) {
                            page.wanted = false;
                        } else {
                            page.clones = page.clones - 1;
                        }
                    });
                    if (c.pages.length === 0) {
                        $scope.chosenCategories.splice($scope.chosenCategories.indexOf(c), 1);
                    }
                }
            });
            if (cat) {
                cat.className = getClass(cat);
            }
        };

        $scope.pushToChosen = function (item) {
            item.wanted = !item.wanted;
            if (item.wanted) {
                $scope.chosenPages.push(item);
                addToChosenCategories(item);
            } else {
                angular.forEach($scope.chosenPages, function (page) {
                    if (page.id === item.id) {
                        $scope.chosenPages.splice($scope.chosenPages.indexOf(item), 1);
                        removeFromChosenCategories(item);
                    }
                });
            }
            $rootScope.$broadcast('masonry.reload');
        };

        var getClass = function (cat) {
            var count = cat.pages.length,
                className = 'single';
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
        if (!$scope.loggedIn) {
            $scope.login();
        }

        $scope.removePage = function (page) {
            removeFromChosenCategories(page);
        };

        $scope.changeMode = function (mode) {
            console.log(mode);
            $scope.dragMode = mode;
        }
    });
