(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('userManage', {
                    url: '/userManage.html',
                    templateUrl: 'modules/userManage/view/userManage.html'
				})
		}])
}());