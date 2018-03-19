(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('userGroupManage', {
                    url: '/userGroupManage.html',
                    templateUrl: 'modules/userGroupManage/view/userGroupManage.html'
				})
		}])
}());