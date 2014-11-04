angular.module('uaFacebookApp.fbService', ['ngResource', 'ngFacebook'])
	.factory('fbService', function($q, $facebook){
		var pages = [
			{
				name: 'Домівка Гданськ',
				id: '298082890229359',
				category: ['organizations', 'places']
			},
			{
				name: 'Związek Ukraińskiej Młodzieży Niezależnej',
				id: '117915798298981',
				category: ['organizations']
			},
			{
				name: 'Związek Ukraińców w Polsce Обєднання Українців у Польщі',
				id: '114426618600294',
				category: ['organizations']
			},
			{
				name: 'Związek Ukraińców w Polsce - Kętrzyn/ OУП гурток в Кентшині',
				id: '256419031180780',
				category: ['organizations']
			},
			{
				name: 'Związek Ukraińców w Polsce, oddział w Szczecinie',
				id: '554378347991014',
				category: ['organizations']
			},
			{
				name: 'Związek Ukraińców w Polsce - Olsztyn/ OУП Міський гурток в Ольштині',
				id: '277335715738563',
				category: ['organizations']
			}
		];

		var latest = [];

		var getInfo = function (id, i) {
			$facebook.api('/' + id).then( 
				function(response) {
					console.log(response);
				},
				function(err) {
					$scope.welcomeMsg = 'Please log in';
				}
			);
		};

		var getFeed = function (id) {
			return $facebook.api({
				method: 'fql.query', 
				query: 'SELECT post_id, actor_id, target_id, type, message, permalink, attachment FROM stream WHERE source_id='+ id + ' AND type IN (46, 56, 60, 66, 80, 128, 247, 295, 373)',
				return_ssl_resources: 1
			});
		};

		var getFeeds = function () {
			var promises = [],
				l = pages.length;
			for (var i = 0; i < l; i++) {
				promises.push(getFeed(pages[i].id));
			}

			return $q.all(promises);
		};

		var getPageDataByPostId = function (id) {
			var p = null;
			angular.forEach(pages, function (page) {
				if (id.indexOf(page.id) === 0) {
					p = {
						id: page.id,
						name: page.name,
						category: page.category
					}
					return p;
				}
			});
			return p;
		};

		var getPageIndexById = function (id) {
			var index = null;
			angular.forEach(pages, function (page, i) {
				if (id === page.id) {
					index = i;
					return index;
				}
			});
			return index;	
		};

		var getLatest = function () {
			var	deferred = $q.defer();
			if (latest.length) {
				deferred.resolve(latest);
			} else {
				getFeeds().then(function (response) {
					angular.forEach(response, function (result) {
						pages[getPageIndexById(getPageDataByPostId(result[0].post_id).id)].feed = result;
						latest.push({
							page: getPageDataByPostId(result[0].post_id),
							news: result[0]
						});
						console.log(result);
					});
					deferred.resolve(latest);
				});
			}
			return deferred.promise;
		};

		var getPages = function () {
			var deferred = $q.defer();
			if (pages[0].feed) {
				deferred.resolve(pages);
			} else {
				getFeeds().then(function (response) {
					angular.forEach(response, function (result) {
						pages[getPageIndexById(getPageDataByPostId(result[0].post_id).id)].feed = result;
						latest.push({
							page: getPageDataByPostId(result[0].post_id),
							news: result[0]
						});
					});
					deferred.resolve(latest);
				});
			}
			return deferred.promise
		};

		var getPageById = function (id) {
			var deferred = $q.defer(),
				index = getPageIndexById(id);
			if (pages[index].feed) {
				deferred.resolve(pages[index]);
			} else {
				getFeed(id).then(
					function (response) {
						pages[index].feed = response;
						deferred.resolve(pages[index]);
					}, function (err) {
						deferred.reject();
					}
				);
			}
			return deferred.promise;
		}

		return {
			getLatest: getLatest,
			getPages: getPages,
			getPageById: getPageById
		}
	});