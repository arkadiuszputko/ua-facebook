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
    		$scope.news = response.feed;
    		console.log($scope.news);
    	},
    	function (error) {

    	}
    );

    $scope.getClass = function (i) {
    	var calculatedClass = '',
    		item = $scope.news[i];
		$scope.news[i].cssClass = [];
    	if (item.attachment.media[0].type === 'photo') {
    		$scope.news[i].cssClass.push('big');
    		calculatedClass += 'big';
    		if (item.attachment.media[0].photo) {
				var dm = item.attachment.media[0].photo.width / item.attachment.media[0].photo.height;
				if (dm < .7) {
					$scope.news[i].cssClass.push('high');
    				calculatedClass += ' high';
    			} else if (dm > 1.5) {
    				$scope.news[i].cssClass.push('wide');
    				calculatedClass += ' wide';
    			} else {
    				$scope.news[i].cssClass.push('square');
    				calculatedClass += ' square';
    			}
    		}
    	}
    	if (i > 0 && $scope.news[i - 1].cssClass[0] !== 'big' && $scope.news[i - 1].cssClass[0] !== 'right') {
    		$scope.news[i].cssClass.push('right');
    		$scope.news[i].cssClass.push('blue');
    		calculatedClass += ' right blue';
    	}
    	return calculatedClass;
    };

    $scope.getImgSrc = function (item) {
    	var src = '';
    	if (item.attachment.media[0].photo && item.attachment.media[0].photo.images) {
    		if (item.attachment.media[0].photo.images.length > 1) {
    			if (item.attachment.media[0].photo.images[0].width > item.attachment.media[0].photo.images[1].width) {
    				src = item.attachment.media[0].photo.images[0].src;
    			} else {
    				src = item.attachment.media[0].photo.images[1].src;
    			}
    		} else if (item.attachment.media[0].photo.images.length === 0) {
    			src = item.attachment.media[0].photo.images[0].src;
    		}
    	} else {
    		src =  item.attachment.media[0].src;
    	}

    	return $sce.trustAsHtml(src);
    }
  });
