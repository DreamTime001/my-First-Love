(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('serviceOrgManage', {
                    url: '/serviceOrgManage.html',
                    templateUrl: 'modules/serviceOrgManage/view/serviceOrgManage.html'
				})
		}])
}());