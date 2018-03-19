(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('assetRegistration', {
                    url: '/assetRegistration.html',
                    templateUrl: 'modules/assetRegistration/view/assetRegistration.html'
				})
		}])
}());