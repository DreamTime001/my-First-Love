(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('home', {
                    url: '/home.html',
                    templateUrl: 'modules/home/view/home.html'
				})

		}])
}());