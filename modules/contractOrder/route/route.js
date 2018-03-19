(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('contractOrder', {
                    url: '/contractOrder.html',
                    templateUrl: 'modules/contractOrder/view/contractOrder.html'
				})
		}])
}());