(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('blacklist', {
                    url: '/blacklist.html',
                    templateUrl: 'modules/blackList/view/blacklist.html'
				})
		}])
}());