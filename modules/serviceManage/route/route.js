(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('serviceManage', {
                    url: '/serviceManage.html',
                    templateUrl: 'modules/serviceManage/view/serviceManage.html'
				})
		}])
}());