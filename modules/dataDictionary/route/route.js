(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('dataDictionary', {
                    url: '/dataDictionary.html',
                    templateUrl: 'modules/dataDictionary/view/dataDictionary.html'
				})
		}])
}());