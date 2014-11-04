'use strict';

angular.module('uaFacebookApp.fbResource', ['ngResource'])
	.factory('fbResource', function($resource){
		return $resource(
			'',
			{},
			{
				getList: {
					method: 'GET',
					isArray: false
				}
			}
		);
	});