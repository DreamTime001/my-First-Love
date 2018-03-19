(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('contractSetting', {
                    url: '/contractSetting.html',
                    templateUrl: 'modules/contractSetting/view/contractSetting.html'
				})
		}])
}());