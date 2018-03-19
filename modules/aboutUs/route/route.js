(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('aboutUs', {
                    url: '/aboutUs.html',
                    templateUrl: 'modules/aboutUs/view/aboutUs.html'
				})
		}])
}());