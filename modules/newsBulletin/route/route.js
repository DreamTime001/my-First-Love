(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('newsBulletin', {
                    url: '/newsBulletin.html',
                    templateUrl: 'modules/newsBulletin/view/newsBulletin.html'
				})
		}])
}());