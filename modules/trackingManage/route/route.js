(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('trackingManage', {
                    url: '/trackingManage.html',
                    templateUrl: 'modules/trackingManage/view/trackingManage.html'
				})
		}])
}());