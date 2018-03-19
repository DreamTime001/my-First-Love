(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('partitionQuery', {
                    url: '/partitionQuery.html',
                    templateUrl: 'modules/partitionQuery/view/partitionQuery.html'
				})
		}])
}());