(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('contractManage', {
                    url: '/contractManage.html',
                    templateUrl: 'modules/contractManage/view/contractManage.html'
				})
		}])
}());