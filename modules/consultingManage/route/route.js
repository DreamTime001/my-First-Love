(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('consultingManage', {
                    url: '/consultingManage.html',
                    templateUrl: 'modules/consultingManage/view/consultingManage.html'
				})
		}])
}());