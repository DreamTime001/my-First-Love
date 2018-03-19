(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('assetOrder', {
                    url: '/assetOrder.html',
                    templateUrl: 'modules/assetOrder/view/assetOrder.html'
				})
		}])
}());