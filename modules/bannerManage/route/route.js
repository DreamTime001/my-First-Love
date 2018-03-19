(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('bannerManage', {
                    url: '/bannerManage.html',
                    templateUrl: 'modules/bannerManage/view/bannerManage.html'
				})
		}])
}());