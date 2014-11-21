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
			return $facebook.api('/' + id + '/feed');
		};

		var getFeeds = function (ids) {
			return $facebook.api('/', {ids: ids, fields: 'feed, cover, events, photos, albums, picture, likes, link, name, about'});
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
			var	deferred = $q.defer(),
				ids = [];

			if (latest.length) {
				deferred.resolve(latest);
			} else {
				angular.forEach(pages, function (page) {ids.push(page.id)});
				getFeeds(ids.join(',')).then(
					function (response) {
						decoratePages(response);
						deferred.resolve(latest);
					}
				);
			}
			return deferred.promise;
		};

		var getPages = function () {
			var	deferred = $q.defer(),
				ids = [];

			if (latest.length) {
				deferred.resolve(latest);
			} else {
				angular.forEach(pages, function (page) {ids.push(page.id)});
				getFeeds(ids.join(',')).then(
					function (response) {
						decoratePages(response);
						deferred.resolve(pages);
					}
				);
			}
			return deferred.promise;
		};

		var getPageById = function (id) {
			var deferred = $q.defer(),
				index = getPageIndexById(id),
				ids = [];
			if (pages[index].feed) {
				deferred.resolve(pages[index]);
			} else {
				angular.forEach(pages, function (page) {ids.push(page.id)});
				getFeeds(ids.join(',')).then(
					function (response) {
						decoratePages(response);
						deferred.resolve(pages[index]);
					}
				);
			}
			return deferred.promise;
		};

		var decoratePages = function (response) {
			angular.forEach(response, function (data) {
				angular.forEach(data.feed.data, function (news, index) {
					news.cssClass = [];
					if (news.picture && news.type === 'photo') {
						news.picture_url = 'https://graph.facebook.com/' + news.object_id + '/picture?type=normal';
						news.cssClass.push('big');
						
						news.cssClass.push('square');
					} else {
						news.picture_url = news.picture;						
					}
					if (news.type === 'video') {
						news.cssClass.push('big');
						news.cssClass.push('video');
					}
					if (news.story) {
						news.display_message = news.story;
					} else {
						news.display_message = news.message;
					}
				});
				pages[getPageIndexById(data.id)].feed = data.feed.data;
				pages[getPageIndexById(data.id)].cover = data.cover;
				pages[getPageIndexById(data.id)].photos = data.photos;
				pages[getPageIndexById(data.id)].albums = data.albums;
				pages[getPageIndexById(data.id)].picture = data.picture;
				pages[getPageIndexById(data.id)].events = data.events;
				pages[getPageIndexById(data.id)].likes = data.likes;
				pages[getPageIndexById(data.id)].link = data.link;
				pages[getPageIndexById(data.id)].name = data.name;
				pages[getPageIndexById(data.id)].about = data.about;
				latest.push({
					page: {
						name: pages[getPageIndexById(data.id)].name,
						id: pages[getPageIndexById(data.id)].id,
						cover: data.cover
					},
					news: pages[getPageIndexById(data.id)].feed[0],
				});
			});
		};

		var decoratePhoto = function (item) {
			var deferred = $q.defer();

		};

		var getDefinedPages = function () {
			return pages;
		};

		var getUserPages = function () {
			$facebook.api('/me/likes', {fields: 'id, name, category, picture'}).then(
				function (response) {
					console.log(response);
				}
			);
		};

		var setPages = function (data) {
			pages = data;
		};

		return {
			getLatest: getLatest,
			getPages: getPages,
			getPageById: getPageById,
			getDefinedPages: getDefinedPages,
			getUserPages: getUserPages,
			setPages: setPages
		}
	});